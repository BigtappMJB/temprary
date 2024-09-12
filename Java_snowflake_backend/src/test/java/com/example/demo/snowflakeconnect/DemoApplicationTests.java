package com.example.demo.snowflakeconnect;

import java.util.Base64;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import com.example.auto.DemoApplication;

@SpringBootTest(classes = DemoApplication.class)
class DemoApplicationTests {

	public static String generateSecretKey() throws Exception {
        KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
        SecretKey secretKey = keyGen.generateKey();
        return Base64.getEncoder().encodeToString(secretKey.getEncoded());
    }

    public static void main(String[] args) throws Exception {
        System.out.println("Secret Key: " + generateSecretKey());
    }

}
