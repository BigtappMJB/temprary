package com.codegen.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
public class GeneratorInput {

	@NotEmpty(message = "Class name must not be empty")
	private String className;

	@Valid
	@NotEmpty(message = "At least one field is required")
	private List<Field> fields;

	
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

		
	}

}
