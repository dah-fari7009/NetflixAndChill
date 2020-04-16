CREATE DATABASE IF NOT EXISTS netflix;
USE netflix;
CREATE TABLE IF NOT EXISTS Users(
    pseudo varchar(30) not null primary key,
    email varchar(255) not null,
    nom varchar(255),
    prenom varchar(255),
    mdp varchar(255) NOT NULL,
    birthday varchar(30) NOT NULL DEFAULT '1990-01-01',
    genre varchar(5),
    adress varchar(255) NOT NULL,
    country varchar(50),
    phone bigint,
    profile_picture varchar(255) NOT NULL DEFAULT "avatar.png",
    cover_picture varchar(255),
    bio text
);

CREATE TABLE Relationships(
    person1 varchar(30),
    person2 varchar(30),
    status int,
    primary key (person1,person2),
    foreign key (person1) references Users(pseudo) 
    ON UPDATE CASCADE ON DELETE CASCADE,
    foreign key (person2) references Users(pseudo) ON UPDATE CASCADE ON DELETE CASCADE  
);


CREATE TABLE IF NOT EXISTS Images(
    img_url varchar(255) primary key,
    creator varchar(30) not null,
    caption text,
    foreign key (creator) references Users(pseudo) 
    ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Messages(
    id serial primary key,
    sender varchar(30) NOT NULL,
    recipient varchar(30) NOT NULL,
    message text NOT NULL
);


CREATE TABLE IF NOT EXISTS Location(
    pseudo varchar(30) primary key,
    lat decimal(12,8),
    lon decimal(12,8),
    foreign key (pseudo) references Users(pseudo) 
    ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE IF NOT EXISTS Criteria(
    pseudo varchar(30) primary key,
    gender char(1),
    min int not null default 18,
    max int not null default 100,
    foreign key(pseudo) references Users(pseudo)
    ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Interests(
    interest_name varchar(255) primary key,
    picture varchar(255) not null
);

CREATE TABLE IF NOT EXISTS Interested_in(
    pseudo varchar(30) not null,
    interest_name varchar(30) not null,
    primary key (pseudo,interest_name),
    foreign key (pseudo) references Users(pseudo) ON UPDATE CASCADE ON DELETE CASCADE,
    foreign key (interest_name) references Interests(interest_name) ON UPDATE CASCADE ON DELETE CASCADE
);

INSERT INTO Users VALUES('fari','faridath.akinotcho@yahoo.fr','Akinotcho','Faridah','$2b$10$zt4pxr.cSJgfA1HM/qucnuFsmu8cEjBl34ptevc8ZiUHOt9zg7x1K',"1999-11-24",'u','4 Mail des Tilleuls Gentilly','France','676323031',"avatar.png", NULL,'Nothing much to say');
INSERT INTO Users(pseudo,mdp,email,nom,prenom,genre,adress,country,phone,bio) VALUES
("kiki",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"k@hotmail.com","Ridras","Karine","f","31 Avenue du Président Nelson Mandela Arcueil,","France","0676323030","Hey, what's up ?!"),
("mejmej",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"pierre.mej@yahoo.fr","Mejane","Pierre","m","38 Rue Léon Savoye Sevran","France","0676323030","Hey, what's up ?!"),
("fred",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"frederic.francine@gmail.com","Francine","Frederic","m","1 Rue de la Butte aux Cailles Paris","France","0676323030","Hey, what's up ?!"),
("fifi",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"ismael.lawani@gmail.com","Lawani","Ismael","m","1795 Hollywood Boulevard Los Angeles","USA","0676323030","Hey, what's up ?!"),
("bisso",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"bisso07@gmail.com","Akinotcho","Alima","f","Rue 12.202, Djako Daho, Cotonou","Bénin","0676323030","Hey, what's up ?!"),
("mouss",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"mdossa@hotmail.com","Dossa","Moussa","u","18, Boulevard Steinmetz, Ganhi","Bénin","0676323030","Hey, what's up ?!"),
("dodo",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"dodo@hotmail.com","Dido","Daniel","u","Bosques de la Pradera, 37500 León, GUA","Mexique","0676323030","Hey, what's up ?!"),
("khaleesi",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"khal@hotmail.com","Targaryen","Daenerys","f","59 Gravelly Hill North Birmingham","UK","0676323030","Hey, what's up ?!"),
("eliott",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"mimi@hotmail.com","Mistral","Karine","f","9 Nelson Road, Birmingham","UK","0676323030","Hey, what's up ?!"),
("lucas",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"lucas@hotmail.com","Lallemand","Lucas","m","1 Rue Victor Cousin Paris","France","0676323030","Hey, what's up ?!"),
("sana100",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"sana@hotmail.com","Nachseim","Sana","f","Strømsveien, 0663 Oslo,","Norvège","0676323030","Hey, what's up ?!"),
("vilde",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"vilde@gmail.com","Narte","Vilde","f","Seterbratveien 49, 1271 Oslo","Norvège","0676323030","Hey, what's up ?!"),
("itru",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"itru@hotmail.com","Ridras","Itru","f","9 Rue Jean François de la Pérouse","France","0676323030","Hey, what's up ?!"),
("baeee",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"b@hotmail.com","DeBeau","Simone","f","4 Avenue de l'Europe Massy","France","0676323030","Hey, what's up ?!"),
("mercy",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"mer@hotmail.com","Denon","Mercy","f","11 Avenue de Champagne Les Ulis","France","0676323030","Hey, what's up ?!"),
("kayc",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"kayc@hotmail.com","Rice","Kaycee","f","3137 Rosedale Boulevard, Louisville, KY 40220","US","0676323030","Hey, what's up ?!"),
("lewlew",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"lew@hotmail.com","Lew","Sean","m","15159 Jackal Street Northwest Ramsey","USA","0676323030","Hey, what's up ?!"),
("riehata",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"rie@hotmail.com","Hata","Rie","f","Akinuro","Japon","0676323030","Hey, what's up ?!"),
("pkie00",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"pkie@hotmail.com","Toyama","Akira","m","Otawara, Préfecture de Tochigi","Japon","0676323030","Hey, what's up ?!"),
("sabri",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"sasa@hotmail.com","Witch","Sabrina","f","5560 Wellesley Drive Brents Junction,","USA","0676323030","Hey, what's up ?!"),
("tyrion",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"tyr@hotmail.com","Lannister","Tyrion","m","Harbury Crescent, Manchester M22 8LY","UK","0676323030","Hey, what's up ?!"),
("elio",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"elio@hotmail.com","Bocconi","Elio","f","Ex Ferrovia Spoleto Norcia, 06041 Cerreto di Spoleto PG","Italie","0676323030","Hey, what's up ?!")
,("poly",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"poly@hotmail.com","Ridras","Karine","f","27 Rue de la Violoune Cuzion","France","0676323030","Hey, what's up ?!"),
("lucty",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"lulu@hotmail.com","Ridras","Karine","f","222 Rue Paul Bert Lyon","France","0676323030","Hey, what's up ?!"),
("hadi",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"hadi@hotmail.com","Hachemn","Hadi","m","13 Villa des Fleurs Montrouge","France","0676323030","Hey, what's up ?!"),
("sara",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"sara@hotmail.com","Onodje","Sara","f","58 Rue de la Madeleine, Lyon ","France","0676323030","Hey, what's up ?!"),
("medhi",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"medhi@hotmail.com","Medine","Medhi","m","13 Rue Arthur Rimbaud Lyon","France","0676323030","Hey, what's up ?!"),
("rasto",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"rasto@hotmail.com","Ridras","Karine","f","15 Rue André Theuriet Aulnay-sous-Bois","France","0676323030","Hey, what's up ?!"),
("des90",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"des0@gmail.com","Disney","Ricco","m","Via G. Bruni 53014 Monteroni d'Arbia SI","Italie","0676323030","Hey, what's up ?!"),
("locco",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"stef@yahoo.com","Salvatore","Stefan","m","Boulevard Bicentenario, 98605 Guadalupe, ZAC","Mexique","0676323030","Hey, what's up ?!"),
("riri",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"k@hotmail.com","McQueen","John","f","9 Place de l'Astrolabe Ottawa","Canada","0676323030","Hey, what's up ?!"),
("momo",'$2b$10$1QCAh0geIle.ci32HiBzKOj3HZw9Nv.rFwIEHESweugqmlY5wAFNi',"momo@hotmail.com","Bah","Mohamed","u","Madore Avenue, Coquitlam, Colombie-Britannique V3L 3P4","Canada","0676323030","Hey, what's up ?!");


INSERT INTO Relationships VALUES
('fari','fred',1),
('fari','mejmej',1),
('medhi','fari',1),
('bisso','khaleesi',1),
('tyrion','elio',1),
('fari','kayc',1),
('fari','eliott',1),
('fari','momo',1),
('fari','bisso',0),
('locco','fari',0),
('fari','sara',0),
('sana100','fari',0),
('mouss','fari',0),
('mouss','bisso',0),
('dodo','fifi',0),
('lewlew','fari',0);


INSERT INTO Location VALUES
("fari", 48.81494480, 2.33214620),
("medhi",45.7877,4.793589999999995),
("riri",45.4979789,-75.4724051),
("itru",48.7269,2.283),
("baeee",48.7267,2.2781099999999697),
('fifi',34.1015991,-118.3311477),
("sabri",34.16173274637727,-118.6794143518539),
('lewlew',45.24756093829076,-93.47788270321803),
("poly",46.48298110262296,1.6089467983692884),
("lucas",48.84837753127895,2.3430558439577),
('mercy',48.6891,2.173400000000015),
('hadi',48.8154898,2.3144544),
('sara',45.7466,4.847790000000032),
('lucty',45.756863604747835,45.756863604747835),
("mejmej",48.942279106023705,2.511052040283971),
("rasto",48.925161233164644,2.485700713262986),
("fred",48.82786494869241,2.3515300804535855),
("des90",43.222888,11.4223699),
("elio",42.82167572165322,12.938305106530606),
("khaleesi",52.51841544495091,-1.8476753622215938),
("eliott",52.509067,-1.8873575),
("riehata",35.731042,139.217028),
("pkie00",36.81888619346535,140.01569508226567),
("vilde",59.82582897537723,10.834417290156352),
("sana100",59.9140455056452,10.803042484262619),
("bisso",6.36541302234957,2.3937746694025464),
("mouss",6.357922153387492,2.43718067892587),
("momo",49.246107449704425,-122.86041006761792),
("locco",22.741574616993194,-102.50166815960807),
("dodo",21.08590578148778,-101.6588071207857),
("kayc",38.214543785288356,-85.64949658591269),
("tyrion",53.389975710793586,-2.2652649695452283);

INSERT INTO Images VALUES ('death.png','fari','How I feel without Netflix ...'),
 ('couch.jpg','fari','My couch is the best'),
 ('img1.jpg','fred','I am dedicated'),
 ('img2.jpg','mejmej',''),
 ('img3.jpg','medhi',''),
 ('img4.jpg','bisso',''),
 ('img5.jpg','eliott',''),
 ('img6.jpg','kayc','');

INSERT INTO Interests(interest_name,picture) VALUES
    ("Comedy","comedy.png"),("Drama","drama.png"),
    ("Action","action.png"),("Thriller","thriller.png"),
    ("Romance","romance.png"),("Animation","animation.png"),
    ("Horror","horror.png"),("Fantasy","fantasy.png"),
    ("Adventure","adventure.png"),
    ("Sci-Fi","scifi.png"),("Historical","historical.png"),("Documentary","documentary.png"),("Western","western.png"),
    ("Philosophical","philo.png"),
    ("Political","politic.png"),
    ("Crime","crime.png"),
    ("Nature","nature.png");

INSERT INTO Criteria(pseudo,gender) VALUES
('fari','a');

INSERT INTO Interested_in VALUES
('fari',"Comedy"),
('fari',"Animation"),
('fari',"Drama"),
('kiki',"Fantasy"),
('mejmej',"Action"),
('riehata',"Comedy"),
('riehata',"Animation"),
('riehata',"Drama"),
('khaleesi',"Horror"),
('tyrion',"Documentary"),
('itru',"Romance"),
("rasto","Comedy"),
("sana100","Sci-Fi"),
("sana100","Drama");



