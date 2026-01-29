package com.anam.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "application_dependents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDependent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull(message = "Application ID é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    @JsonBackReference
    private MemberApplication application;

    @NotBlank(message = "Nome do dependente é obrigatório")
    @Column(name = "name", nullable = false, length = 255)
    private String name;

    @NotBlank(message = "Parentesco é obrigatório")
    @Column(name = "relationship", nullable = false, length = 50)
    private String relationship; // child, stepchild, other

    @Column(name = "profession", length = 255)
    private String profession;

    @Column(name = "age")
    private Integer age;
}
