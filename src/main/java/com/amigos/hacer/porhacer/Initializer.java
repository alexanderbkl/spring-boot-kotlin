package com.amigos.hacer.porhacer;

import com.amigos.hacer.porhacer.models.Event;
import com.amigos.hacer.porhacer.models.Group;
import com.amigos.hacer.porhacer.models.GroupRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Collections;
import java.util.stream.Stream;

@Component
public class Initializer implements CommandLineRunner {

    private final GroupRepository repository;

    public Initializer(GroupRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... strings) {
        Stream.of("Seattle JUG", "Denver JUG", "Utah JUG", "Richmond JUG")
                .forEach(name -> repository.save(new Group(name)));

        Group djug = repository.findByName("Seattle JUG");
        Event e = Event.builder().title("Full Stack Reactive")
                .description("Reactive with Spring Boot + React")
                .date(Instant.parse("2022-09-13T17:00:00.000Z"))
                .build();
        djug.setEvents(Collections.singleton(e));
        repository.save(djug);

        repository.findAll().forEach(System.out::println);
    }
}
