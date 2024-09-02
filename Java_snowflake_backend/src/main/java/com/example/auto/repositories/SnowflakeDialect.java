package com.example.auto.repositories;

import org.hibernate.boot.model.TypeContributions;
import org.hibernate.dialect.Dialect;
import org.hibernate.dialect.identity.IdentityColumnSupport;
import org.hibernate.dialect.identity.IdentityColumnSupportImpl;
import org.hibernate.service.ServiceRegistry;
import org.hibernate.type.SqlTypes;

public class SnowflakeDialect extends Dialect {}
