package com.cmd.excel.exception;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.cmd.constants.CmdConstants;

@ControllerAdvice
public class DmaErrorHandler extends ResponseEntityExceptionHandler
{
    @ExceptionHandler(HttpClientErrorException.Unauthorized.class)
    protected ResponseEntity<Object> handleAuthenticationError(RuntimeException ex, WebRequest request)
    {
        return handleExceptionInternal(ex, 
            CmdConstants.MSG_CANNOT_LOGIN, 
            new HttpHeaders(), HttpStatus.UNAUTHORIZED, request);
    }
}