CREATE DATABASE IF NOT EXISTS `prpose`;
USE prpose;

CREATE TABLE `users` (
    `user_id` int(10)  NOT NULL UNIQUE AUTO_INCREMENT,
    `username` varchar(40) NOT NULL,
    `email` varchar(255) NOT NULL UNIQUE,
    `password` varchar(60) NOT NULL,
    `creation_date` datetime DEFAULT NULL,
    PRIMARY KEY (username)
) ENGINE=InnoDB ;

CREATE TABLE `themes` (
    `theme_name` varchar(50) NOT NULL,
    PRIMARY KEY (theme_name)
) ENGINE=InnoDB;

CREATE TABLE `posts` (
    `post_id` int(10) NOT NULL AUTO_INCREMENT,
    `post_parent_id` int(10) DEFAULT NULL,
    `username` varchar(40) NOT NULL,
    `title` varchar(200) NOT NULL,
    `content` TEXT(5000) NOT NULL,
    `publication_date` datetime DEFAULT NULL,
    PRIMARY KEY (post_id)
) ENGINE=InnoDB;

CREATE TABLE `post_vote` (
  `username` varchar(40) NOT NULL,
  `post_id` int(10) NOT NULL,
  `upvote` tinyint(1) NOT NULL,
  `vote_date` datetime DEFAULT NULL,
  PRIMARY KEY (username, post_id)
) ENGINE=InnoDB ;

CREATE TABLE `post_theme` (
  `post_id` int(10) NOT NULL,
  `theme_name` varchar(50) NOT NULL,
  PRIMARY KEY (post_id, theme_name)
) ENGINE=InnoDB;

CREATE TABLE `comments` (
  `comment_id` int(10) NOT NULL AUTO_INCREMENT,
  `comment_parent_id` int(10) DEFAULT NULL,
  `post_id` int(10) NOT NULL,
  `username` varchar(40) NOT NULL,
  `content` TEXT(5000) NOT NULL,
  `publication_date` datetime DEFAULT NULL,
  PRIMARY KEY (comment_id)
) ENGINE=InnoDB;

CREATE TABLE `comment_vote` (
  `username` varchar(40) NOT NULL,
  `comment_id` int(10) NOT NULL,
  `upvote` tinyint(1) NOT NULL,
  `vote_date` datetime DEFAULT NULL,
  PRIMARY KEY (username,comment_id)
) ENGINE=InnoDB;




--
-- Index pour la table `users`


-- Contraintes pour la table `comment_vote`
--
ALTER TABLE `comment_vote`
  ADD CONSTRAINT `fk_comment_comment_vote` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`comment_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_comment_vote` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_parent_comment` FOREIGN KEY (`comment_parent_id`) REFERENCES `comments` (`comment_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `fk_post_comment` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_comment` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON UPDATE CASCADE;

--
-- Contraintes pour la table `post_theme`
--
ALTER TABLE `post_theme`
  ADD CONSTRAINT `fk_postID_post_theme` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_theme_post_theme` FOREIGN KEY (`theme_name`) REFERENCES `themes` (`theme_name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `post_vote`
--
ALTER TABLE `post_vote`
  ADD CONSTRAINT `fk_post_post_vote` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_username_post_vote` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `fk_parent_post` FOREIGN KEY (`post_parent_id`) REFERENCES `posts` (`post_id`) ON DELETE NO ACTION,
  ADD CONSTRAINT `fk_username_post` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE NO ACTION ON UPDATE CASCADE;


INSERT INTO `users` (`username`, `password`, `creation_date`) VALUES
('alex', '$2b$12$Car8TfzNdAGd7WkcUY4aEOPtN4X7SNHEAezvwbPyRmIAEHcZaQ9cu', '2019-05-13 00:00:00'),
('jordan', '$2b$10$TqoNe10muuXBVeFuWP91OePQDiGmyo50FC4Q2Ii65DT3U6YOTD8hC',  '2019-06-24 00:00:00'),
('user', '$2b$10$d4BjlsbeYjCwKdk9Vg3Tz.9cfTSxN/WGHTO/RkWP7NgQVYLeAm78W', '2019-05-25 00:00:00');

