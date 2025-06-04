package com.codegen.exception;

public class RapidControllerException extends RuntimeException {
    public RapidControllerException(String message) {
        super(message);
    }

    public RapidControllerException(String message, Throwable cause) {
        super(message, cause);
    }
}
