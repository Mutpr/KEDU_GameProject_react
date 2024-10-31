CREATE TABLE USERS(
    USER_SEQ NUMBER NOT NULL,
    USER_ID VARCHAR2(256) NOT NULL,
    USER_PASSWORD VARCHAR2(4000) NOT NULL,
    USER_NAME VARCHAR2(4000) NOT NULL
);
CREATE SEQUENCE USER_SEQ START WITH 1 INCREMENT BY 1 NOCACHE;

insert into users values(user_seq.nextval, 'admin', '1', '관리자');

select user_name from users where user_id='admin' and user_password='1';

select user_name as user_name from users where user_id='admin' and user_password='1';
commit;