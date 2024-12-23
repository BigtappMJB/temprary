
/**
 * 	Date,			Author,		Description
 * 
 * 	2021-17-11,		ISV7915,	TemplateService  class 
 * 								Initial version
 *	2021-19-11,		ISV7915,	Template CRUD service logic added
 *  2021-22-11,		ISV7915,	Method level comments added
 */

package com.cmd.excel.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.cmd.domain.TableTemplateDetailsDto;
import com.cmd.domain.response.Response;
import com.cmd.excel.model.TableTemplateDetails;
import com.cmd.excel.model.TableTemplates;
import com.cmd.excel.repository.TableTemplateDetailsRepository;
import com.cmd.excel.repository.TableTemplatesRepository;
import com.cmd.excel.utils.CmdUtils;

@Service
public class TemplateService {

	@Autowired
	TableTemplatesRepository tableTeplatesRepository;

	@Autowired
	TableTemplateDetailsRepository tableTemplateDetailsRepository;

	Response response = new Response();
	CmdUtils dmaUtils = new CmdUtils();

	/**
	 * For Getting table Columns
	 * 
	 * @param tableName
	 * @return List<DmaColumn>
	 */
	public List<String> getTableColumns(String tableName) {
		return tableTeplatesRepository.getTableColumns(tableName);
	}

	/**
	 * For getting table templates
	 * 
	 * @return List<TableTemplates>
	 */
	public List<TableTemplates> getAllTableTemplates() {
		return tableTeplatesRepository.getallTemplates();
	}

	/**
	 * For getting table template by table id
	 * 
	 * @param tableId
	 * @return TableTemplates
	 */
	public TableTemplates getTemplateByTable(int tableId) {
		return tableTeplatesRepository.getTemplateByTableId(tableId);
	}

	/**
	 * For getting templateDetails for table id and template id
	 * 
	 * @param tableId
	 * @param templateId
	 * @return List<TableTemplateDetails>
	 */
	public List<TableTemplateDetails> getTemplateDetails(int tableId, int templateId) {
		return tableTemplateDetailsRepository.getTemplateDetails(tableId, templateId);
	}

	/**
	 * For getting table template details for tableFildName, tableId and templateId
	 * 
	 * @param tableFieldName
	 * @param tableId
	 * @param templateId
	 * @return TableTemplateDetails
	 */
	public TableTemplateDetails getTableTemplateDetails(String tableFieldName, int tableId, int templateId) {
		return tableTemplateDetailsRepository.getTableTemplateDetails(tableFieldName, tableId, templateId);
	}
	
	/**
	 * For getting templateDetails for table id
	 * 
	 * @param tableId
	 * @return List<TableTemplateDetails>
	 */
	public List<TableTemplateDetails> getTemplateDetailsPrimaryKey(int tableId) {
		return tableTemplateDetailsRepository.getTemplateDetailsPrimaryKey(tableId);
	}

	/**
	 * For checking template details exists or not
	 * 
	 * @param tableFieldName
	 * @param tableId
	 * @param templateId
	 * @return integer
	 */
	public int checkTemplateDetailsExists(String tableFieldName, int tableId, int templateId) {
		return tableTemplateDetailsRepository.checkTemplateDetailsExists(tableFieldName, tableId, templateId);
	}

	/**
	 * For saving template details
	 * 
	 * @param tableTemplateDetails
	 */
	public void saveTemplateDetails(TableTemplateDetailsDto tableTemplateDetails) {
		TableTemplateDetails tmp = new TableTemplateDetails();
		tmp = dmaUtils.tableTemplateDetailsDtoToEntity(tableTemplateDetails, tmp);
		tableTemplateDetailsRepository.save(tmp);
	}

	/**
	 * For getting Max table FieldId
	 * 
	 * @return integer
	 */
	public int getMaxTableFieldId() {
		return tableTemplateDetailsRepository.getMaxFieldId();
	}

	/**
	 * For getting table primary key columns
	 * 
	 * @param tableId
	 * @return List<String>
	 */
	public List<String> getTablePrimaryKeyColumns(int tableId) {
		return tableTemplateDetailsRepository.getPrimaryKeyColumns(tableId);
	}

	public Object createTemplate(TableTemplates template) {
        return tableTeplatesRepository.save(template);
    }

}
