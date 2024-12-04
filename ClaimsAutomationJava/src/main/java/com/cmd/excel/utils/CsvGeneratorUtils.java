/**
 * 	Date,			Author,		Description
 * 
 * 	2021-25-11,		ISV7915,		CsvGeneratorUtils  class 
 */
package com.cmd.excel.utils;

import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.cmd.constants.CmdConstants;

@Component
public class CsvGeneratorUtils {
	private static final Logger logger = LoggerFactory.getLogger(CsvGeneratorUtils.class);
	/**
	 * For constructing filename
	 * 
	 * @param baseName
	 * @return String
	 */
	public String getFileName(String baseName) {
		DateFormat dateFormat = new SimpleDateFormat("yyyyMMdd");
		String dateTimeInfo = dateFormat.format(new Date());
		return "DM_" + baseName.concat(String.format("_%s.csv", dateTimeInfo));
	}

	/**
	 * For writing header line
	 * 
	 * @param result
	 * @param sheet
	 * @throws SQLException
	 */
	public void writeHeaderLine(ResultSet result, XSSFSheet sheet) throws SQLException {
		logger.info("Write header line containing column names");
		// write header line containing column names
		ResultSetMetaData metaData = result.getMetaData();
		int numberOfColumns = metaData.getColumnCount();

		Row headerRow = sheet.createRow(0);

		// exclude the first column which is the ID field
		for (int i = 1; i <= numberOfColumns; i++) {
			String columnName = metaData.getColumnName(i);
			Cell headerCell = headerRow.createCell(i - 1);
			headerCell.setCellValue(columnName);
		}
	}

	/**
	 * For checking value exists in array
	 * 
	 * @param arr
	 * @param toCheckValue
	 * @return boolean
	 */
	public boolean check(String[] arr, String toCheckValue) {
		return Arrays.stream(arr).anyMatch(x -> x.equalsIgnoreCase(toCheckValue));
	}

	/**
	 * For writing data values to each line
	 * 
	 * @param result
	 * @param workbook
	 * @param sheet
	 * @throws SQLException
	 */
	public void writeDataLines(ResultSet result, XSSFWorkbook workbook, XSSFSheet sheet) throws SQLException {
		logger.info("Write date lines to cvs file");
		ResultSetMetaData metaData = result.getMetaData();
		int numberOfColumns = metaData.getColumnCount();

		int rowCount = 1;

		while (result.next()) {
			Row row = sheet.createRow(rowCount++);

			for (int i = 1; i <= numberOfColumns; i++) {
				Object valueObject = result.getObject(i);

				Cell cell = row.createCell(i - 1);
				if (valueObject != null) {
					if (valueObject instanceof Boolean) {
						cell.setCellValue((Boolean) valueObject);
					} else if (valueObject instanceof Double) {
						cell.setCellValue((double) valueObject);
					} else if (valueObject instanceof Integer) {
						cell.setCellValue(String.valueOf(valueObject));
					} else if (valueObject instanceof Float) {
						cell.setCellValue((float) valueObject);
					} else if (valueObject instanceof Date) {
						cell.setCellValue((Date) valueObject);
						formatDateCell(workbook, cell);
					} else
						cell.setCellValue(valueObject.toString().replace(".0", ""));
				}
			}
		}
	}

	/**
	 * For formatting date cell
	 * 
	 * @param workbook
	 * @param cell
	 */
	private void formatDateCell(XSSFWorkbook workbook, Cell cell) {
		CellStyle cellStyle = workbook.createCellStyle();
		CreationHelper creationHelper = workbook.getCreationHelper();
		cellStyle.setDataFormat(creationHelper.createDataFormat().getFormat(CmdConstants.DATE_FORMAT));
		cell.setCellStyle(cellStyle);
	}
}
