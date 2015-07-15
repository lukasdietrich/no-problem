create table if not exists `settings` (
    `key` varchar ( 32 ) not null primary key ,
    `value` not null
) ;

create table if not exists `mirrors` (
    `id` integer not null primary key autoincrement ,
    `repository` varchar ( 64 ) not null unique
) ;