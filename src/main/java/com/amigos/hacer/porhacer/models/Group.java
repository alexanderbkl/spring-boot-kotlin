package com.amigos.hacer.porhacer.models;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

import jakarta.persistence.*;
import java.util.Set;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
@Entity
@Table(name = "user_group")
public class Group {

    @Id
    @GeneratedValue
    private Long id;
    @NonNull
    private String name;
    @ManyToOne(cascade = CascadeType.PERSIST)
    private User owner;

    @ManyToMany(cascade = CascadeType.PERSIST)
    private Set<User> members;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
    private Set<Task> tasks;
}