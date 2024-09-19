package com.example.auto.utill;

import io.jsonwebtoken.*;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    private final String SECRET_KEY = "IHUI9kPbBNGb+Q0wzbABLj9GyTZzbCqivNO6MQ5mt9U=IHUI9kPbBNGb+Q0wzbABLj9GyTZzbCqivNO6MQ5mt9U=";

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        if (claims == null) {
            return null;  // Return null if claims are not available
        }
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        try {
            return Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .setAllowedClockSkewSeconds(60)
                    .parseClaimsJws(token)
                    .getBody();
        } catch (SignatureException e) {
            // Handle signature mismatch error
            System.out.println("JWT signature does not match!");
        } catch (ExpiredJwtException e) {
            // Handle token expiration
            System.out.println("JWT expired");
        } catch (Exception e) {
            // Handle other potential issues
            System.out.println("Error parsing JWT token: " + e.getMessage());
        }
        return null;  // Return null in case of exception
    }

    private Boolean isTokenExpired(String token) {
        Date expiration = extractExpiration(token);
        return expiration != null && expiration.before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        long expirationTimeInMillis = 1000 * 60 * 60; // 1 hour
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expirationTimeInMillis))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        String username = extractUsername(token);
        return (username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public static String encodeBase64Url(String input) {
        return Base64.getUrlEncoder().encodeToString(input.getBytes());
    }

    public static String decodeBase64Url(String input) {
        return new String(Base64.getUrlDecoder().decode(input));
    }
}
