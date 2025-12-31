package com.github.peachy006.storeboughtbackendproper.repository;

import com.github.peachy006.storeboughtbackendproper.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@SuppressWarnings("unused")
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

}
