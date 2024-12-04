package com.cmd.excel.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.cloud.context.scope.refresh.RefreshScopeRefreshedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.cmd.excel.csv.CsvGeneratorTasks;
import com.cmd.excel.repository.AccessRepository;

import net.javacrumbs.shedlock.core.LockAssert;
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;

@Service
@RefreshScope
@EnableScheduling
public class SchedularService implements ApplicationListener<RefreshScopeRefreshedEvent> {
	private static final Logger logger = LoggerFactory.getLogger(SchedularService.class);

	@Value("${scheduler1}")
	private int schedularValue1;

	@Value("${scheduler2}")
	private int schedularValue2;

	@Autowired
	private CsvGeneratorTasks csvGeneratorTasks;

	@Autowired
	AccessRepository accessRepository;

//	@Scheduled(cron = "${csv.gen.cron.expression1}")
	@SchedulerLock(name = "MORNING_SCHEDULER", lockAtLeastFor = "PT1M", lockAtMostFor = "PT2M")
	public void csvGenerator1() {
		logger.info("schedularValue1 {}", schedularValue1);
//		csvGeneratorTasks.csvGenerator(schedularValue1,"MORNING_SCHEDULER");
//		String status = accessRepository.getCsv(schedularValue1);
//		logger.info("Schedular 1 Status : {}", status);
//		if (status.equals("0")) {
//			accessRepository.updateCsv(1, 1);
//			csvGeneratorTasks.csvGenerator(schedularValue1);
//		}
//		accessRepository.updateCsv(0, 1);
		LockAssert.assertLocked();
	}

//	@Scheduled(cron = "${csv.gen.cron.expression2}")
	@SchedulerLock(name = "EVENING_SCHEDULER", lockAtLeastFor = "PT1M", lockAtMostFor = "PT2M")
	public void csvGenerator2() {
		logger.info("schedularValue2 {}", schedularValue2);
//		csvGeneratorTasks.csvGenerator(schedularValue2,"EVENING_SCHEDULER");
//		String status = accessRepository.getCsv(schedularValue1);
//		logger.info("Schedular 2 Status : {}", status);
//		if (status.equals("0")) {
//			accessRepository.updateCsv(1, 1);
//			csvGeneratorTasks.csvGenerator(schedularValue2);
//		}
//		accessRepository.updateCsv(0, 1);
		LockAssert.assertLocked();
	}

	@Override
	public void onApplicationEvent(RefreshScopeRefreshedEvent refreshScopeRefreshedEvent) {
		logger.info("======> Event : {}", refreshScopeRefreshedEvent);
		logger.info("======> Time : {}", refreshScopeRefreshedEvent.getTimestamp());
	}
}