Create Database hyb1d_assignment;
Use hyb1d_assignment;

--
-- Table structure for table `buyers`
--

DROP TABLE IF EXISTS `buyers`;

CREATE TABLE `buyers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(60) NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Table structure for table `sellers`
--

DROP TABLE IF EXISTS `sellers`;
CREATE TABLE `sellers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(60) NOT NULL,
  `password` text NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Table structure for table `jwt_tokens`
--

DROP TABLE IF EXISTS `jwt_tokens`;
CREATE TABLE `jwt_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` varchar(45) NOT NULL,
  `type` int NOT NULL,
  `token` text NOT NULL,
  PRIMARY KEY (`id`)
);

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `buyer_id` int NOT NULL,
  `seller_id` int NOT NULL,
  `items` json NOT NULL,
  PRIMARY KEY (`id`),
  KEY `order_to_seller_idx` (`seller_id`),
  CONSTRAINT `order_to_seller` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `price` bigint NOT NULL,
  `seller_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `products_to_seller_frk_idx` (`seller_id`),
  CONSTRAINT `products_to_seller_frk` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


DELIMITER ;;
CREATE PROCEDURE `add_new_buyer`(
	IN username varchar(60),
    IN password text
)
BEGIN
	set @temp_buyer_id = null;
    select id into @temp_buyer_id from buyers where buyers.username = username;
    if (isnull(@temp_buyer_id)) then
		insert into buyers(username, password) values (username, password);
        select 1 as status;
	else 
		select 0 as status;
	end if;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE `add_new_seller`(
	IN username varchar(60),
    IN password text
)
BEGIN
	set @temp_seller_id = null;
    select id into @temp_seller_id from sellers where sellers.username = username;
    if (isnull(@temp_seller_id)) then
		insert into sellers(username, password) values (username, password);
        select 1 as status;
	else 
		select 0 as status;
	end if;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE `login_buyer`(
	IN username varchar(60)
)
BEGIN
	set @temp_buyer_id = null;
    select id into @temp_buyer_id from buyers where buyers.username = username;
    if (isnull(@temp_buyer_id)) then
        select 0 as status;
	else
		select 1 as status;
        select * from buyers where id = @temp_buyer_id;
	end if;
END ;;
DELIMITER ;


DELIMITER ;;
CREATE PROCEDURE `login_seller`(
	IN username varchar(60)
)
BEGIN 
	set @temp_seller_id = null;
    select id into @temp_seller_id from sellers where sellers.username = username;

    if (isnull(@temp_seller_id)) then
        select 0 as status;
	else
		select 1 as status;
        select * from sellers where id = @temp_seller_id;
	end if;
END ;;
DELIMITER ;
