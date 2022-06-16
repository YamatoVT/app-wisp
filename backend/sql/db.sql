CREATE TABLE tpersona(
    id_persona SERIAl,
    dni character varying(20) UNIQUE NOT NULL,
    nombres_persona character varying(140) NOT NULL,
    apellidos_persona character varying(140) NOT NULL,
    constraint PK_id_persona_tpersona primary key(id_persona)
);

CREATE TABLE tcliente(
    id_cliente SERIAL,
    id_persona INTEGER,
    mac_equipo character(17) NOT NULL, -- formato de mac falso E0-10-TG-9K-1X-JK
    direccecion_cliente character varying(2000) NOT NULL,
    correo_cliente character varying(255) NULL,
    telefono_movil_cliente character(11) NULL,
    telefono_local_cliente character(11) NULL,
    estatus_cliente character(1) NULL, -- 1 o 0
    constraint PK_id_cliente_tcliente primary key(id_cliente),
    constraint FK_id_persona_tcliente foreign key(id_persona) references tpersona(id_persona)  ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE tip(
    id_ip SERIAL,
    ip character varying(15) NOT NULL, -- 192.168.1.100 o 192.168.100.100
    disponibulidad_ip character(1) NOT NULL, -- 1 o 0
    constraint PK_id_ip_tip primary key(id_ip)
);

CREATE TABLE tplan(
    id_plan SERIAL,
    nombres_plan character varying(140) NOT NULL,
    cantidad INTEGER NOT NULL, -- numero 1, 5, 10
    velocidad character varying(5) NOT NULL, -- KB, MB, GB
    disponibulidad_plan character(1) NOT NULL, -- 1 o 0
    constraint PK_id_plan_tplan primary key(id_plan)
);

CREATE TABLE tprecio_plan(
    id_precio_plan SERIAL,
    id_plan INTEGER NOT NULL,
    precio decimal NOT NULL,
    estatus_precio_plan character(1) NOT NULL,
    constraint PK_id_precio_plan_tprecio_plan primary key(id_precio_plan),
    constraint FK_id_plan_tprecio_plan foreign key(id_plan) references tplan(id_plan) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE tcontrato(
    id_contrato SERIAL,
    id_cliente INTEGER NOT NULL,
    id_ip INTEGER NOT NULL,
    id_precio_plan INTEGER NOT NULL,
    estatus_contrato character(1) NOT NULL, -- 1 o 0
    constraint PK_id_contrato_tcontrato primary key(id_contrato),
    constraint FK_id_cliente_tcontrato foreign key(id_cliente) references tcliente(id_cliente) ON UPDATE CASCADE ON DELETE CASCADE,
    constraint FK_id_ip_tcontrato foreign key(id_ip) references tip(id_ip) ON UPDATE CASCADE ON DELETE CASCADE,
    constraint FK_id_precio_plan_tcontrato foreign key(id_precio_plan) references tprecio_plan(id_precio_plan) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE tservicio(
    id_servicio SERIAL,
    id_contrato INTEGER NOT NULL,
    fecha_inicio_servicio DATE NOT NULL,
    fecha_corte_servicio DATE NOT NULL,
    fecha_tope_servicio DATE NOT NULL,
    estatus_servicio character(2) NOT NULL, -- CR=>>> servicio corriendo , PA =>>> servicio pagado, T=>>> servicio terminado
    constraint PK_id_servicio_tservicio primary key(id_servicio),
    constraint FK_id_contrato_tservicio foreign key(id_contrato) references tcontrato(id_contrato) ON UPDATE CASCADE ON DELETE CASCADE
);