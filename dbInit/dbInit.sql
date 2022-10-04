create table users (
  email varchar(250) primary key not null,
  username varchar(250) not null,
  fname varchar(250) not null,
  lname varchar(250) not null,
  phone varchar(250) not null,
  password varchar(250) not null,
  passreset boolean default false not null,
  email_token varchar(250)
);