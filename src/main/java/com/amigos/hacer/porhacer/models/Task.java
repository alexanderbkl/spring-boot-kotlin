package com.amigos.hacer.porhacer.models;


import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "tasks")
public class Task {

    @Id
    @GeneratedValue
    private Long id;
    @NonNull
    private String name;
    private String description;
    @NonNull
    private TaskStatus status;

    //groups that this task belongs to
    @ManyToMany(mappedBy = "tasks")
    private Set<Group> groups;

    @ManyToOne
    @JoinColumn(name="group_id", nullable=false)
    private Group group;

}
