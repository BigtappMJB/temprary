package com.codegen.DTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
public class IncomingGeneratorDTO {
    private String tableName;
    private List<IncomingField> fields;
    private String menuName;
    private String subMenuName;
    private String description;
    private String pageName;
    private String routePath;
    private String moduleName;
    private List<String> permissionLevels;
    private String masterTable; // New field for master table
    private String relationshipType; // New field for relationship type

    @Getter
    @Setter
    public static class IncomingField {
        private Column column;
        private String name;
        private String type;
        private Boolean primary;
        @JsonProperty("uiType")
        private String uiType; // Field for UI type (e.g., dropdown, Checkbox)
        @JsonProperty("numOptions")
        private Integer numOptions; // Field for number of options
        @JsonProperty("optionValues")
        private List<String> optionValues; // Field for option values (e.g., ["me", "you", "us"])

        // Ensure optionValues is never null
        public List<String> getOptionValues() {
            if (optionValues == null) {
                optionValues = new ArrayList<>();
            }
            return optionValues;
        }

        @Getter
        @Setter
        public static class Column {
            private String label;
            private String value;
        }
    }
}
