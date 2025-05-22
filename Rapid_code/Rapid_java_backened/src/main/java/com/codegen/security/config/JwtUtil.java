//package com.codegen.security.config;
//
//
//
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.SignatureAlgorithm;
//import io.jsonwebtoken.JwtException;
//
//import org.springframework.stereotype.Component;
//
//import java.time.Instant;
//import java.time.temporal.ChronoUnit;
//import java.util.Date;
//
//
//@Component
//public class JwtUtil {
//
//  private final String SECRET_KEY = "your-secure-secret";
//
//  public String generateToken(String username) {
//    return Jwts.builder()
//      .setSubject(username)
//      .setIssuedAt(new Date())
//      .setExpiration(Date.from(Instant.now().plus(1, ChronoUnit.HOURS)))
//      .signWith(SignatureAlgorithm.HS256, SECRET_KEY)
//      .compact();
//  }
//
//  public String extractUsername(String token) {
//    return Jwts.parser()
//      .setSigningKey(SECRET_KEY)
//      .parseClaimsJws(token)
//      .getBody()
//      .getSubject();
//  }
//
//  public boolean validateToken(String token) {
//    try {
//      Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
//      return true;
//    } catch (JwtException e) {
//      return false;
//    }
//  }
//}
