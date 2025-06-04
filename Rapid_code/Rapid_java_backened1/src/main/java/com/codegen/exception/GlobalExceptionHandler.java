package com.codegen.exception;






import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RapidControllerException.class)
    public ResponseEntity<ErrorResponse> handleControllerException(RapidControllerException ex) {
    	log.error("ControllerException: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(), 
            ex.getMessage(), 
            "Controller Error"
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
    	log.error("MethodArgumentException: {}", ex.getMessage(), ex);
        String errorMessage = ex.getBindingResult().getFieldError().getDefaultMessage();
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(),
            errorMessage,
            "Validation Error"
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ServiceException.class)
    public ResponseEntity<ErrorResponse> handleServiceException(ServiceException ex) {
        log.error("ServiceException: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(), 
            ex.getMessage(), 
            "Service Error"
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }


    
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
    	 log.error("Unhandled Exception: {}", ex.getMessage(), ex);
        ErrorResponse error = new ErrorResponse(
            LocalDateTime.now(), 
            ex.getMessage(), 
            "Unknown Error"
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
