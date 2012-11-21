--- Table: cells

-- DROP TABLE cells;

CREATE TABLE cells
(
  id serial NOT NULL,
  geom geometry,
  selected boolean DEFAULT false,
  crawled boolean DEFAULT false,
  urbanratio numeric DEFAULT 0,
  CONSTRAINT cells_pk PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE cells OWNER TO oroick;

-- Index: cells_gist

-- DROP INDEX cells_gist;

CREATE INDEX cells_gist
  ON cells
  USING gist
  (geom);





-- Table: facebook

-- DROP TABLE facebook;

CREATE TABLE facebook
(
  id character varying(100) NOT NULL,
  "name" character varying(300),
  category character varying(200),
  the_geom geometry,
  street character varying(200),
  city character varying(200),
  state character varying(100),
  country character varying(100),
  postal_code character varying(50),
  likes integer,
  founded smallint,
  checkins integer,
  talking_about integer,
  date_crawled date NOT NULL,
  sample boolean DEFAULT false,
  CONSTRAINT pk_facebook_place PRIMARY KEY (id, date_crawled)
)
WITH (
  OIDS=FALSE
);

-- Index: facebook_spat_index

-- DROP INDEX facebook_spat_index;

CREATE INDEX facebook_spat_index
  ON facebook
  USING gist
  (the_geom);




-- Table: foursq_categories

-- DROP TABLE foursq_categories;

CREATE TABLE foursq_categories
(
  id character varying(200) NOT NULL,
  "name" character varying(200) NOT NULL,
  parent_category character varying(200),
  CONSTRAINT pk_cat PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);

-- Index: index_foursq_categories_pk

-- DROP INDEX index_foursq_categories_pk;

CREATE INDEX index_foursq_categories_pk
  ON foursq_categories
  USING btree
  (id);




-- Table: foursq_venues

-- DROP TABLE foursq_venues;

CREATE TABLE foursq_venues
(
  id character varying(200) NOT NULL,
  "name" character varying(200),
  address character varying(400),
  city character varying(200),
  state character varying(200),
  country character varying(200),
  the_geom geometry,
  checkins integer,
  users integer,
  tips integer,
  photos integer,
  postal_code character varying(50),
  date_crawled date NOT NULL,
  sample boolean DEFAULT false,
  tags text[],
  CONSTRAINT pk_foursqazre_venues PRIMARY KEY (id, date_crawled)
)
WITH (
  OIDS=FALSE
);

-- Index: idx_foursq_venues

-- DROP INDEX idx_foursq_venues;

CREATE INDEX idx_foursq_venues
  ON foursq_venues
  USING gist
  (the_geom);

-- Index: index_foursq_venues_id

-- DROP INDEX index_foursq_venues_id;

CREATE INDEX index_foursq_venues_id
  ON foursq_venues
  USING btree
  (id);



-- Table: foursq_venues_categories

-- DROP TABLE foursq_venues_categories;

CREATE TABLE foursq_venues_categories
(
  venue_id character varying(200) NOT NULL,
  category_id character varying(200) NOT NULL,
  CONSTRAINT pk_venues_categories PRIMARY KEY (venue_id, category_id),
  CONSTRAINT fk_cat_category FOREIGN KEY (category_id)
      REFERENCES foursq_categories (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);

-- Index: foursquare_venues_cats_cid

-- DROP INDEX foursquare_venues_cats_cid;

CREATE INDEX foursquare_venues_cats_cid
  ON foursq_venues_categories
  USING btree
  (category_id);

-- Index: foursquare_venues_cats_vid

-- DROP INDEX foursquare_venues_cats_vid;

CREATE INDEX foursquare_venues_cats_vid
  ON foursq_venues_categories
  USING btree
  (venue_id);