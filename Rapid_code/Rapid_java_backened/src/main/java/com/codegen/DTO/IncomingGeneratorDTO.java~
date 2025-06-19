package com.codegen.DTO;

import lombok.Getter;
import lombok.Setter;

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
        private String uiType; // New field for UI type (e.g., dropdown, Checkbox)

        @Getter
        @Setter
        public static class Column {
            private String label;
            private String value;
        }
    }
}
