

CREATE DATABASE IF NOT EXISTS rush_store CHARACTER SET  utf8 collate utf8_general_ci;

use rush_store;

create table user_info (
	user_id bigint primary key auto_increment,
    username varchar(32),
    password varchar(32),
    consumption double
);

create table good_info (
	good_id bigint primary key auto_increment,
    good_name varchar(32),
    good_price double,
    good_detail text,
    repo_count bigint,
    cas_version int
);

create table rush_record (
	user_id bigint,
    good_id bigint,
    amount int,
    status char,
    create_time datetime  
);


insert into user_info (username,password,consumption)values ('zhangsan','1234',12000);
insert into user_info (username,password,consumption)values ('lisi','1234',10000);
insert into user_info (username,password,consumption)values ('wangwu','1234',9000);
insert into user_info (username,password,consumption)values ('zhaoliu','1234',3000);
insert into user_info (username,password,consumption)values ('tianqi','1234',22000);

insert into good_info (good_name,good_price,good_detail,repo_count,cas_version) values ('xiaomi 9',1999,'good phone',10,0);
insert into good_info (good_name,good_price,good_detail,repo_count,cas_version) values ('air pods',799,'wireless bluetooth earphone',100,0);
insert into good_info (good_name,good_price,good_detail,repo_count,cas_version) values ('iphone 11',4599,'64gb',50,0);
insert into good_info (good_name,good_price,good_detail,repo_count,cas_version) values ('maotai',1499,'drink together',30,0);
insert into good_info (good_name,good_price,good_detail,repo_count,cas_version) values ('tesla',299998,'electronic motor car',20,0);



