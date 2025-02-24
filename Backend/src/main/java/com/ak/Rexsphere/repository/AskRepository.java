package com.ak.Rexsphere.repository;

import com.ak.Rexsphere.entity.Ask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AskRepository extends JpaRepository<Ask, Long> {

    List<Ask> findByCategory(String category);

}
