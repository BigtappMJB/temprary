package com.cmd.excel.utils;

import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;

import com.coveo.saml.SamlClient;
import com.coveo.saml.SamlException;
import com.coveo.saml.SamlResponse;

public class SamlUtils {
	private static final Logger logger = LoggerFactory.getLogger(SamlUtils.class);
	
	@Value("${dma.sso.enabled}")
	private Boolean isSsoEnabled;
	@Value("${dma.app.identifier}")
	private String identifier;
	@Value("${idp.url}")
	private String idpUrl;
	@Value("${adfs.metadata.url}")
	private String adfsFileName;

//	For Authenticate with Saml
	public void atuthenticateWIthSaml2() {
		HttpServletRequest servletRequest = null;
		if (Boolean.TRUE.equals(isSsoEnabled)) {
			try {
				SamlClient client = SamlClient.fromMetadata(identifier, idpUrl, getXml(adfsFileName),
						SamlClient.SamlIdpBinding.POST);
				String encodedRequest = client.getSamlRequest();
				String idpUrlClient = client.getIdentityProviderUrl();
				@SuppressWarnings("null")
				String encodedResponse = servletRequest.getParameter("SAMLResponse");
				SamlResponse response = client.decodeAndValidateSamlResponse(encodedResponse, "");
				String authenticatedUser = response.getNameID(); // String encodedRequest =
//				getLogoutRequest(nameID); // String encodedRequest =
//				getSamlLogoutResponse(statusCode, statusMessage); // String
				logger.info(encodedRequest, idpUrl, encodedResponse, authenticatedUser, idpUrlClient);
			} catch (SamlException e) {
				logger.info("Error : {}", e.getMessage());
			}
		}
	}

	private static Reader getXml(String name) {
		return getXml(name, StandardCharsets.UTF_8);
	}

	private static Reader getXml(String name, Charset charset) {
		return new InputStreamReader(SamlUtils.class.getResourceAsStream(name), charset);
	}
}
