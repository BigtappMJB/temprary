package com.codegen.exception;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.AllArgsConstructor;

@Getter
@AllArgsConstructor
public class ErrorResponse {

    private final LocalDateTime timestamp;
    private final String message;
    private final String details;

}


