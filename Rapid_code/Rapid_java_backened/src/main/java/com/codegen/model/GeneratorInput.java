package com.codegen.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class GeneratorInput {

	@NotEmpty(message = "Class name must not be empty")
	private String className;

	@Valid
	@NotEmpty(message = "At least one field is required")
	private List<Field> fields;

	private String masterTable; // New field for master table
	private String relationshipType; // New field for relationship type

	@Getter
	@Setter
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Field {
		@JsonProperty("name")
		@NotEmpty(message = "Field name must not be empty")
		private String name;

		@JsonProperty("type")
		@NotEmpty(message = "Field type must not be empty")
		private String type;

		@JsonProperty("primary")
		private Boolean primary;

		@JsonProperty("uiType")
		private String uiType; // Field for UI type (e.g., Checkbox, radio-button)

		@JsonProperty("numOptions")
		private Integer numOptions; // Field for number of options

		@JsonProperty("optionValues")
		private List<String> optionValues; // Field for option values (e.g., ["me", "you", "us"])

		public boolean isPrimary() {
			return primary != null && primary;
		}

		// Ensure optionValues is never null
		public List<String> getOptionValues() {
			if (optionValues == null) {
				optionValues = new ArrayList<>();
			}
			return optionValues;
		}
	}
}
