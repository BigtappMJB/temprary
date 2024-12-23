package com.cmd.excel.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.cmd.constants.CmdConstants;
import com.cmd.domain.response.Response;
import com.cmd.excel.model.embed.AdhocBloombergRequestEmbed;
import com.cmd.excel.model.embed.AltGeographicalLimitRequestEmbed;
import com.cmd.excel.model.embed.AltinvestmentStrategyRequestEmbed;
import com.cmd.excel.model.embed.AssectMixEffsaMappingRequestEmbed;
import com.cmd.excel.model.embed.BondForwardRequestEmbed;
import com.cmd.excel.model.embed.CashSecuritiesRequestEmbed;
import com.cmd.excel.model.embed.DervNvSectypeMapRequestEmbed;
import com.cmd.excel.model.embed.EfmNavBizsecSectypeExclRequestEmbed;
import com.cmd.excel.model.embed.EfmNavExclRequestEmbed;
import com.cmd.excel.model.embed.EntityParentChildRequestEmbed;
import com.cmd.excel.model.embed.EntityXreferenceRequestEmbed;
import com.cmd.excel.model.embed.NtucSecurityTypeRequestEmbed;
import com.cmd.excel.model.embed.OtcDerivativesRequestEmbed;
import com.cmd.excel.model.embed.PrivateEquitiesRequestEmbed;
import com.cmd.excel.model.embed.ProxyAssetWeightRequestEmbed;
import com.cmd.excel.model.embed.UnquotedSecuritiesRequestEmbed;
import com.cmd.excel.model.templates.CountryRegion;
import com.cmd.excel.model.templates.Currency;
import com.cmd.excel.model.templates.EntityTable;
import com.cmd.excel.model.templates.EntityXreference;
import com.cmd.excel.model.templates.TempVidalClaims;
import com.cmd.excel.repository.CmdTableRepository;
import com.cmd.excel.repository.templates.CountryRegionRepository;
import com.cmd.excel.repository.templates.CurrencyRepository;
import com.cmd.excel.repository.templates.EntityTableRepository;
import com.cmd.excel.repository.templates.EntityXreferenceRepository;
import com.cmd.excel.repository.templates.TempVidalClaimsRepository;


@Service
public class UploadTemplatesService {
	private static final Logger logger = LoggerFactory.getLogger(UploadTemplatesService.class);
	Response response = new Response();

	@Autowired
	CountryRegionRepository countryRegionRepository;

	@Autowired
	CurrencyRepository currencyRepository;

	@Autowired
	EntityXreferenceRepository entityXreferenceRepository;

	@Autowired
	EntityTableRepository entityTableRepository;

	@Autowired
	TempVidalClaimsRepository tempVidalClaimsRepository; 

	@Autowired
	CmdTableRepository dmaTableRepository;

	public void switchStatement(String[] eachRecordValues, String tableName, List<String> list,
			String[] defaultValueList) {
		switch (tableName.toLowerCase()) {
		
		case "country_region":
			countryRegionDto(eachRecordValues, list, defaultValueList);
			break;
		case "currency":
			currencyDto(eachRecordValues, list, defaultValueList);
			break;
		
		default:
			break;
		}
		switch (tableName.toLowerCase()) {
		
		
		case "entity":
			entityTableDto(eachRecordValues, list, defaultValueList);
			break;
		
		case "entity_xreference":
			entityXreferenceDto(eachRecordValues, list, defaultValueList);
			break;
			
		case "temp_vidal_claims":
			tempVidalClaims(eachRecordValues, list, defaultValueList);
			break;
		default:
			unknownTemplate(tableName);
			break;
		}
	}

	public List<Map<String, Object>> switchStatement2(String tableName) {
		List<Map<String, Object>> dbVMapList = new ArrayList<>();
		switch (tableName.toLowerCase()) {
		
		
		case "country_region":
			dbVMapList = countryRegionRepository.getCountryRegionRepositoryRequest();
			return dbVMapList;
		case "currency":
			dbVMapList = currencyRepository.getCurrencyRepositoryRequest();
			return dbVMapList;
		default:
			break;
		}
		switch (tableName.toLowerCase()) {
		
		case "entity":
			dbVMapList = entityTableRepository.getEntityTableRepositoryRequest();
			return dbVMapList;
		
		case "entity_xreference":
			dbVMapList = entityXreferenceRepository.getEntityXreferenceRepositoryRequest();
			return dbVMapList;
			
		case "temp_vidal_claims":
			dbVMapList = tempVidalClaimsRepository.getTempVidalClaims();
			return dbVMapList;
		
		case "security_master_view":
			dbVMapList = dmaTableRepository.getSecurityMasterView();
			return dbVMapList;
		default:
			unknownTemplate(tableName);
			break;
		}
		return dbVMapList;
	}

	private void unknownTemplate(String tableName) {
		logger.info("Unknown Table Template : {}", tableName);
		response.setStatusCode(HttpStatus.NOT_FOUND.value());
		response.setMessage("Unknown Table Template : " + tableName);
		response.setErrorMessage("Unknown Table Template : " + tableName);
	}

	


	public void countryRegionDto(String[] eachRecordValues, List<String> list, String[] defaultValueList) {
		CountryRegion template = new CountryRegion();

		template.setSrcRecordInsertBy(defaultValueList[0]);
		template.setSrcRecordInsertDttm(defaultValueList[1]);
		template.setSrcRecordUpdateBy(defaultValueList[2]);
		template.setSrcRecordUpdateDttm(defaultValueList[3]);
		template.setSrcRecordDeleteBy(defaultValueList[4]);
		template.setSrcRecordDeleteDttm(defaultValueList[5]);
		template.setSrcRecordDeleteInd(defaultValueList[6]);
		template.setLastUpdateUser(defaultValueList[7]);
		template.setLastUpdateDateTime(defaultValueList[8]);

		template.setCrtyIsoCode(eachRecordValues[list.indexOf("CTRY_ISO_CODE")]);
		template.setCtryDes(eachRecordValues[list.indexOf("CTRY_DES")]);
		template.setRegion(eachRecordValues[list.indexOf("REGION")]);
		countryRegionRepository.save(template);
	}

	public void currencyDto(String[] eachRecordValues, List<String> list, String[] defaultValueList) {
		Currency template = new Currency();

		template.setSrcRecordInsertBy(defaultValueList[0]);
		template.setSrcRecordInsertDttm(defaultValueList[1]);
		template.setSrcRecordUpdateBy(defaultValueList[2]);
		template.setSrcRecordUpdateDttm(defaultValueList[3]);
		template.setSrcRecordDeleteBy(defaultValueList[4]);
		template.setSrcRecordDeleteDttm(defaultValueList[5]);
		template.setSrcRecordDeleteInd(defaultValueList[6]);
		template.setLastUpdateUser(defaultValueList[7]);
		template.setLastUpdateDateTime(defaultValueList[8]);

		template.setCurrDes(eachRecordValues[list.indexOf("CURR_DES")]);
		template.setCurrIsoCode(eachRecordValues[list.indexOf("CURR_ISO_CODE")]);
		currencyRepository.save(template);
	}



	public void entityXreferenceDto(String[] eachRecordValues, List<String> list, String[] defaultValueList) {
		EntityXreference template = new EntityXreference();
		EntityXreferenceRequestEmbed embedTemplate = new EntityXreferenceRequestEmbed();

		embedTemplate.setEntityId(eachRecordValues[list.indexOf(CmdConstants.ENTITY_ID)]);
		embedTemplate.setXrefAccountId(eachRecordValues[list.indexOf("XREF_ACCOUNT_ID")]);
		embedTemplate.setXrefAccountIdType(eachRecordValues[list.indexOf("XREF_ACCOUNT_ID_TYPE")]);

		template.setSrcRecordInsertBy(defaultValueList[0]);
		template.setSrcRecordInsertDttm(defaultValueList[1]);
		template.setSrcRecordUpdateBy(defaultValueList[2]);
		template.setSrcRecordUpdateDttm(defaultValueList[3]);
		template.setSrcRecordDeleteBy(defaultValueList[4]);
		template.setSrcRecordDeleteDttm(defaultValueList[5]);
		template.setSrcRecordDeleteInd(defaultValueList[6]);
		template.setLastUpdateUser(defaultValueList[7]);
		template.setLastUpdateDateTime(defaultValueList[8]);
		template.setEntityXreferenceRequestEmbed(embedTemplate);
		entityXreferenceRepository.save(template);
	}

	public void tempVidalClaims(String[] eachRecordValues, List<String> list, String[] defaultValueList) {
		TempVidalClaims template = new TempVidalClaims();


		template.setClaimInsId(eachRecordValues[28]);
        template.setClaimDt(eachRecordValues[31]);
        template.setClaimAmount(eachRecordValues[64]);
        template.setClaimDescription(eachRecordValues[55]);
        template.setClaimStatus(eachRecordValues[103]);
        
        template.setEmpTpaid(eachRecordValues[14]);
        template.setClmHospital(eachRecordValues[34]);
        template.setClmDoa(eachRecordValues[32]);
        template.setClmDod(eachRecordValues[33]);
        template.setClmType(eachRecordValues[58]);
        template.setClmPreAuthId(eachRecordValues[29]);
        template.setClmSettNo(eachRecordValues[101]);
        template.setClmSettAmt(eachRecordValues[99]);
        template.setClmSettDate(eachRecordValues[100]);
        
        template.setClmDisAmt(eachRecordValues[87]);
        template.setClmSettChqBnk(eachRecordValues[16]);
        template.setClmSettChqDt(eachRecordValues[102]);

        template.setClmBillDetails(eachRecordValues[4]);
        template.setClmAllowedAmt(eachRecordValues[20]);
        template.setClmAllowedId(eachRecordValues[29]);
        
        
        tempVidalClaimsRepository.save(template);
	}

	public void entityTableDto(String[] eachRecordValues, List<String> list, String[] defaultValueList) {
		EntityTable template = new EntityTable();

		template.setSrcRecordInsertBy(defaultValueList[0]);
		template.setSrcRecordInsertDttm(defaultValueList[1]);
		template.setSrcRecordUpdateBy(defaultValueList[2]);
		template.setSrcRecordUpdateDttm(defaultValueList[3]);
		template.setSrcRecordDeleteBy(defaultValueList[4]);
		template.setSrcRecordDeleteDttm(defaultValueList[5]);
		template.setSrcRecordDeleteInd(defaultValueList[6]);
		template.setLastUpdateUser(defaultValueList[7]);
		template.setLastUpdateDateTime(defaultValueList[8]);

		template.setEntityId(eachRecordValues[list.indexOf(CmdConstants.ENTITY_ID)]);
		template.setEntityName(eachRecordValues[list.indexOf(CmdConstants.ENTITY_NAME)]);
		template.setEntityType(eachRecordValues[list.indexOf("ENTITY_TYPE")]);
		template.setManagerCode(eachRecordValues[list.indexOf("MANAGER_CODE")]);
		template.setSubAccount(eachRecordValues[list.indexOf("SUB_ACCOUNT")]);
		template.setInvestmentDiscretion(eachRecordValues[list.indexOf("INVESTMENT_DISCRETION")]);
		template.setStrategyGroup(eachRecordValues[list.indexOf("STRATEGY_GROUP")]);
		template.setCompositeHierachy(eachRecordValues[list.indexOf("COMPOSITE_HIERARCHY")]);
		template.setFxAggLevel(eachRecordValues[list.indexOf("FX_AGG_LEVEL")]);
		template.setAssetclass(eachRecordValues[list.indexOf("ASSET_CLASS")]);
		template.setBusinessSector(eachRecordValues[list.indexOf(CmdConstants.BUSINESS_SECTOR)]);

		String fundInceptionDateValue = eachRecordValues[list.indexOf("FUND_INCEPTION_DATE")];
		template.setFundInceptionDate(fundInceptionDateValue.isEmpty() ? null : fundInceptionDateValue);
		String fundTerminateDateValue = eachRecordValues[list.indexOf("FUND_TERMINATE_DATE")];
		template.setFundTerminateDate(fundTerminateDateValue.isEmpty() ? null : fundTerminateDateValue);

		template.setInactiveFlag(eachRecordValues[list.indexOf(CmdConstants.INACTIVE_FLAG)]);
		entityTableRepository.save(template);
	}


}
