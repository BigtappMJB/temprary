package com.cmd.excel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.ServletComponentScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

import net.javacrumbs.shedlock.spring.annotation.EnableSchedulerLock;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@ServletComponentScan
@EnableAutoConfiguration
@EnableScheduling
@EnableSchedulerLock(defaultLockAtMostFor = "PT10S")
@EnableAsync
@RefreshScope
public class CmdAppApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
		return builder.sources(CmdAppApplication.class);
	}

	public static void main(String[] args) {
		SpringApplication.run(CmdAppApplication.class, args);
	}

}
