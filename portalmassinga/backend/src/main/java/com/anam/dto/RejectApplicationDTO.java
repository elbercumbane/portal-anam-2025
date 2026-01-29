package com.anam.dto;

public class RejectApplicationDTO {
    private String observations;

    public RejectApplicationDTO() {
    }

    public RejectApplicationDTO(String observations) {
        this.observations = observations;
    }

    public String getObservations() {
        return observations;
    }

    public void setObservations(String observations) {
        this.observations = observations;
    }
}

