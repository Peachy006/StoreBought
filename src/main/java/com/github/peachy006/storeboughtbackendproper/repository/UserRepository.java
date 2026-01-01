package com.github.peachy006.storeboughtbackendproper.repository;

import com.github.peachy006.storeboughtbackendproper.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/*
this is the interface that tells spring to use JPA to interact with the database
we use @repository to tell spring that this class is a repository
we use @jpaRepository to tell spring that this class is a JPA repository
when using the JPA repository we give it 2 values, the name of the class that we use and the type of the primary key
i had to use suppress warning, i dont really remember why, i think it was because of an error which i later fixed, maybe you can actually just remove it
im too scared
 */


@SuppressWarnings("unused")
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
