import com.diffplug.gradle.spotless.SpotlessExtension
import org.gradle.api.file.DuplicatesStrategy.INCLUDE
import org.gradle.api.tasks.testing.logging.TestLogEvent
import org.gradle.plugins.ide.idea.model.IdeaModel
import org.springframework.boot.gradle.tasks.bundling.BootJar
import org.springframework.boot.gradle.tasks.run.BootRun
import ru.vyarus.gradle.plugin.quality.QualityExtension

group = retrieve("group")
version = retrieve("version")

/** Java 25 is long term supported and therefore chosen as the default. */
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(25)
        implementation = JvmImplementation.VENDOR_SPECIFIC
        vendor = JvmVendorSpec.ORACLE
    }
}

/** The repositories used to download the dependencies. */
repositories {
    mavenCentral()
    mavenLocal()
}

/** Project Plugins. */
plugins {
    // IntelliJ IDEA Management
    id("idea")

    // Java Management
    id("java-library")

    // Spring boot Management
    id("org.springframework.boot")
    id("io.spring.dependency-management")

    // Quality plugin for Checkstyle, PMD and Spotbugs.
    id("ru.vyarus.quality")

    // Spotbugs is a static analysis tool to find bugs in Java code. (required by quality plugin)
    id("com.github.spotbugs") apply false

    // Spotless is a code formatter that uses a set of pre-defined rules to format the code.
    id("com.diffplug.spotless")

    // Automatically generates a list of updatable dependencies.
    id("com.github.ben-manes.versions")

    // The project-report plugin provides file reports on dependencies, tasks, etc.
    id("project-report")

    // Automatic lombok and delombok configuration.
    id("io.freefair.lombok")
}

/** Configure the dependencies required within the project. */
dependencies {
    // ======= ANNOTATION PROCESSORS =======
    // lombok is used to reduce boilerplate code for model classes.
    annotationProcessor("org.projectlombok", "lombok")

    // annotation processor that generates metadata about classes in your application that are annotated with @ConfigurationProperties.
    annotationProcessor("org.springframework.boot", "spring-boot-configuration-processor")

    // Provides Mapstruct annotations for spring.
    annotationProcessor("org.mapstruct", "mapstruct-processor", retrieve("mapStructVersion"))

    // ======= RUNTIME DEPENDENCIES =======
    // H2 in-memory database for development and testing.
    runtimeOnly("com.h2database", "h2", retrieve("h2Version"))

    // ======= SPRINGBOOT DEPENDENCIES =======
    implementation("org.springframework.boot", "spring-boot-starter-actuator")
    implementation("org.springframework.boot", "spring-boot-starter-data-jpa")
    implementation("org.springframework.boot", "spring-boot-starter-web")
    implementation("org.springframework.boot", "spring-boot-starter-liquibase")
    implementation("org.springframework.boot", "spring-boot-starter-validation")

    // ======= IMPLEMENTATION DEPENDENCIES =======
    // Open API documentation generation.
    implementation("org.springdoc", "springdoc-openapi-starter-webmvc-ui", retrieve("springdocVersion"))

    // JFrame Starters - common libraries for JFrame based applications
    implementation("io.github.jframeoss", "starter-jpa", retrieve("jframeStarterVersion"))

    // Used to validate entities and beans
    implementation("jakarta.servlet", "jakarta.servlet-api", retrieve("jakartaServletVersion"))

    // Mapstruct is used to generate code to map from domain model classes to rest application model classes
    implementation("org.mapstruct", "mapstruct", retrieve("mapStructVersion"))

    // LogstashEncoder is used to encode log messages in logstash format
    implementation("net.logstash.logback", "logstash-logback-encoder", retrieve("logstashEncoderVersion"))

    // ======= TEST DEPENDENCIES =======
    testImplementation("org.springframework.boot", "spring-boot-test")
    testImplementation("org.springframework.security", "spring-security-test", retrieve("springSecurityTestVersion"))
    testImplementation("org.springframework.boot", "spring-boot-testcontainers")
    testImplementation("org.springframework.boot", "spring-boot-starter-test") {
        exclude("com.vaadin.external.google", module = "android-json")
    }
}

// ============== PLUGIN CONFIGURATION ================
/** IDE Settings: Point to the correct directories for source and resources. */
configure<IdeaModel> {
    module {
        isDownloadJavadoc = true
        isDownloadSources = true
        testSources.setFrom(file("src/test/java"))
        testResources.setFrom(file("src/test/resources"))
        sourceDirs.add(file("src/main/java"))
        resourceDirs.add(file("src/main/resources"))
    }
}

/** Configuration for the Spotless plugin. */
configure<SpotlessExtension> {
    spotless {
        java {
            cleanthat()
            toggleOffOn()
            target("src/main/java/**/*.java", "src/test/java/**/*.java")
            eclipse().configFile("src/quality/config/spotless/styling.xml")

            endWithNewline()
            removeUnusedImports()
            trimTrailingWhitespace()
            importOrder("", "java|jakarta|javax", "groovy", "org", "com", "\\#")
        }
    }
}

/** Configuration propertied for the quality plugin. */
configure<QualityExtension> {
    autoRegistration = true
    configDir = "src/quality/config/"

    spotbugsVersion = retrieve("spotbugsVersion")
    spotbugs = true

    pmdVersion = retrieve("pmdVersion")
    pmd = true

    checkstyleVersion = retrieve("checkstyleVersion")
    checkstyle = true

    codenarcVersion = retrieve("codenarcVersion")
    codenarc = true
}


// ============== STATIC FUNCTIONS ================
fun retrieve(property: String): String {
    val foundProperty = project.findProperty(property) as String?
        ?: throw IllegalArgumentException("Property $property not found")
    return foundProperty.replace("\"", "")
}

/** Shared JVM arguments for running the application and tests. */
val sharedJvmArgs = listOf(
    "-XX:+UseG1GC",
    "-Xms512m",
    "-Xmx4096m",
    "-XX:MetaspaceSize=512m",
    "-XX:MaxMetaspaceSize=1024m",
    "-XX:MaxMetaspaceFreeRatio=60",
    "-XX:+EnableDynamicAgentLoading",
    "-XX:+HeapDumpOnOutOfMemoryError",
    "-Djava.awt.headless=true",
    "-Dspring.output.ansi.enabled=ALWAYS"
)

// ============== TASK CONFIGURATION ================
tasks.getByName<BootJar>("bootJar") {
    duplicatesStrategy = INCLUDE
    archiveVersion.set(project.version.toString())
    archiveBaseName.set(retrieve("artifactName"))

    manifest {
        attributes("Name" to retrieve("artifactName"))
        attributes("Implementation-Title" to retrieve("artifactDescription"))
        attributes("Implementation-Version" to version)
    }
}

tasks.getByName<Jar>("jar") {
    enabled = false
}

tasks.withType<Test> {
    systemProperty("jframe.name", retrieve("artifactName"))
    systemProperty("jframe.group", retrieve("group"))
    systemProperty("jframe.version", retrieve("version"))
    useJUnitPlatform()
    jvmArgs(sharedJvmArgs)
    testLogging {
        showCauses = true
        showExceptions = true
        events = setOf(
            TestLogEvent.FAILED,
            TestLogEvent.PASSED,
            TestLogEvent.SKIPPED
        )
    }
}

tasks.withType<ProcessResources> {
    filesMatching("application.yml") {
        filter { line ->
            line.replace("APPLICATION_VERSION", retrieve("version"))
        }
        filter { line ->
            line.replace("APPLICATION_NAME", retrieve("artifactName"))
        }
        filter { line ->
            line.replace("APPLICATION_GROUP", retrieve("group"))
        }
    }
}

tasks.withType<JavaCompile> {
    dependsOn("spotlessApply")
    options.isDeprecation = true
    options.encoding = "UTF-8"
    options.compilerArgs.addAll(
        arrayOf(
            "-Xlint:all",
            "-Xlint:-serial",
            "-Xlint:-processing",
            "-Xlint:-this-escape",
            "-Werror"
        )
    )
}

tasks.named<BootRun>("bootRun") {
    systemProperty("jframe.application.name", retrieve("artifactName"))
    systemProperty("jframe.application.group", retrieve("group"))
    systemProperty("jframe.application.version", retrieve("version"))
    jvmArgs(sharedJvmArgs)
}
