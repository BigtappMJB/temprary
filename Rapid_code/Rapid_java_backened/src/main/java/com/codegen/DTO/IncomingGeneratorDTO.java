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

    // getters/setters
    @Getter
    @Setter
    public static class IncomingField {
        private Column column;
        private String name; // may be empty or missing
        private String type;
        private Boolean primary;

        // getters/setters
        @Getter
        @Setter
        public static class Column {
            private String label;
            private String value;
            // getters/setters
        }
    }
}
