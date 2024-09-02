package com.example.auto.entity;

import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "student_registration")
public class RegistrationModel {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "registration_id")
	private int registrationId;

	@Column(name = "first_name")
	private String firstName;

	@Column(name = "middle_name")
	private String middleName;

	@Column(name = "last_name")
	private String lastName;

	@Column(name = "email_id")
	private String emailId;

	@Column(name = "mobile_number")
	private String mobileNumber;

	@Column(name = "date_of_birth")
	private String dateOfBirth;



	@Column(name = "house_number")
	private String houseNumber;

	@Column(name = "street")
	private String street;

	@Column(name = "town_city")
	private String townCity;

	



	@Column(name = "pin_code")
	private String pinCode;

	

	

	@Column(name = "mother_tongue")
	private String motherTongue;

	@Column(name = "english_communicate")
	private String englishCommunicate;

	

	@Column(name = "terms_condition")
	private String termsCondition;

	@Column(name = "ip_address")
	private String ipAddress;

	@Column(name = "passport_photo")
	private String passportPhoto;

	

	@Column(name = "other_profession")
	private String otherProfession;

	@Column(name = "profession_working_hours")
	private int professionWorkingHours;


	@Column(name = "pride_qualification")
	private String prideQualification;


	@Column(name = "family_details")
	private String familyDetails;

	@Column(name = "consent_family")
	private String consentFamily;

	@Column(name = "resistance_family")
	private String resistanceFamily;

	@Column(name = "participating_family")
	private String participatingFamily;

	@Column(name = "participate_name")
	private String participateName;

	@Column(name = "past_practice")
	private String pastPractice;

	@Column(name = "hobbies")
	private String hobbies;

	@Column(name = "hobbies_aside")
	private String hobbiesAside;

	@Column(name = "reference_name")
	private String referenceName;

	@Column(name = "reference_relationship")
	private String referenceRelationship;

	@Column(name = "reference_mobile")
	private String referenceMobile;

	@Column(name = "course_briefly")
	private String courseBriefly;

	

	@Column(name = "is_mentor_mapped")
	private String isMentorMapped;



	

	@Column(name = "created_date")
	private String createdDate;


	public int getRegistrationId() {
		return registrationId;
	}

	public void setRegistrationId(int registrationId) {
		this.registrationId = registrationId;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public void setReferenceMobile(String referenceMobile) {
		this.referenceMobile = referenceMobile;
	}

	public String getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}


	


	public String getHouseNumber() {
		return houseNumber;
	}

	public void setHouseNumber(String houseNumber) {
		this.houseNumber = houseNumber;
	}

	public String getStreet() {
		return street;
	}

	public void setStreet(String street) {
		this.street = street;
	}

	public String getTownCity() {
		return townCity;
	}

	public void setTownCity(String townCity) {
		this.townCity = townCity;
	}

	


	public String getPinCode() {
		return pinCode;
	}

	public void setPinCode(String pinCode) {
		this.pinCode = pinCode;
	}

	public String getMotherTongue() {
		return motherTongue;
	}

	public void setMotherTongue(String motherTongue) {
		this.motherTongue = motherTongue;
	}

	public String getEnglishCommunicate() {
		return englishCommunicate;
	}

	public void setEnglishCommunicate(String englishCommunicate) {
		this.englishCommunicate = englishCommunicate;
	}

	

	public String getTermsCondition() {
		return termsCondition;
	}

	public void setTermsCondition(String termsCondition) {
		this.termsCondition = termsCondition;
	}

	public String getIpAddress() {
		return ipAddress;
	}

	public void setIpAddress(String ipAddress) {
		this.ipAddress = ipAddress;
	}

	public String getPassportPhoto() {
		return passportPhoto;
	}

	public void setPassportPhoto(String passportPhoto) {
		this.passportPhoto = passportPhoto;
	}

	

	public int getProfessionWorkingHours() {
		return professionWorkingHours;
	}

	public void setProfessionWorkingHours(int professionWorkingHours) {
		this.professionWorkingHours = professionWorkingHours;
	}

	

	public String getPrideQualification() {
		return prideQualification;
	}

	public void setPrideQualification(String prideQualification) {
		this.prideQualification = prideQualification;
	}

	

	public String getFamilyDetails() {
		return familyDetails;
	}

	public void setFamilyDetails(String familyDetails) {
		this.familyDetails = familyDetails;
	}

	public String getConsentFamily() {
		return consentFamily;
	}

	public void setConsentFamily(String consentFamily) {
		this.consentFamily = consentFamily;
	}

	public String getResistanceFamily() {
		return resistanceFamily;
	}

	public void setResistanceFamily(String resistanceFamily) {
		this.resistanceFamily = resistanceFamily;
	}

	public String getParticipatingFamily() {
		return participatingFamily;
	}

	public void setParticipatingFamily(String participatingFamily) {
		this.participatingFamily = participatingFamily;
	}

	public String getParticipateName() {
		return participateName;
	}

	public void setParticipateName(String participateName) {
		this.participateName = participateName;
	}

	public String getPastPractice() {
		return pastPractice;
	}

	public void setPastPractice(String pastPractice) {
		this.pastPractice = pastPractice;
	}

	public String getHobbies() {
		return hobbies;
	}

	public void setHobbies(String hobbies) {
		this.hobbies = hobbies;
	}

	public String getHobbiesAside() {
		return hobbiesAside;
	}

	public void setHobbiesAside(String hobbiesAside) {
		this.hobbiesAside = hobbiesAside;
	}

	public String getReferenceName() {
		return referenceName;
	}

	public void setReferenceName(String referenceName) {
		this.referenceName = referenceName;
	}

	public String getReferenceRelationship() {
		return referenceRelationship;
	}

	public void setReferenceRelationship(String referenceRelationship) {
		this.referenceRelationship = referenceRelationship;
	}

	public String getReferenceMobile() {
		return referenceMobile;
	}

	public String getCourseBriefly() {
		return courseBriefly;
	}

	public void setCourseBriefly(String courseBriefly) {
		this.courseBriefly = courseBriefly;
	}

	

	

	public String getIsMentorMapped() {
		return isMentorMapped;
	}

	public void setIsMentorMapped(String isMentorMapped) {
		this.isMentorMapped = isMentorMapped;
	}

	

	public String getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}

	

	public String getOtherProfession() {
		return otherProfession;
	}

	public void setOtherProfession(String otherProfession) {
		this.otherProfession = otherProfession;
	}

}
