import { mysqlTable as table } from 'drizzle-orm/mysql-core';
import * as t from 'drizzle-orm/mysql-core';

export const levelEnum = t.mysqlEnum('level', ['super_admin', 'admin', 'nasabah']);

export const users = table('users', {
	id: t.int('id').autoincrement().primaryKey(),
	email: t.varchar('email', { length: 150 }).notNull().unique(),
	password: t.varchar('password', { length: 255 }).notNull(),
	is_admin: t.boolean('is_admin').default(false),
	level: levelEnum,
	updated_at: t.timestamp(),
	created_at: t.timestamp().defaultNow().notNull(),
	deleted_at: t.timestamp(),
});

export const nasabah = table('nasabah', {
	id: t.int('id').autoincrement().primaryKey(),
	user_id: t.int('user_id').references(() => users.id),
	nama_lengkap: t.varchar('nama_lengkap', { length: 150 }).notNull(),
	rt: t.varchar('rt', { length: 10 }).notNull(),
	nomor_kartu: t.varchar('nomor_kartu', { length: 50 }).unique(),
	updated_at: t.timestamp(),
	created_at: t.timestamp().defaultNow().notNull(),
	deleted_at: t.timestamp(),
}, (table) => [
	t.foreignKey({
		name: 'user_fk',
		columns: [table.user_id],
		foreignColumns: [users.id]
	})
]);
export const tipeSampah = table('tipe_sampah', {
	id: t.int('id').primaryKey(),
	nama: t.varchar('nama', { length: 100 }).notNull(), // contoh: "Plastik"
	deskripsi: t.text('deskripsi'), // optional
	hargaPerKg: t.decimal('harga_per_kg', { precision: 10, scale: 2 }).notNull(), // harga per kg
	updated_at: t.timestamp(),
	created_at: t.timestamp().defaultNow().notNull(),
	deleted_at: t.timestamp(),
});
export const transaksi = table('transaksi', {
	id: t.int('id').primaryKey().autoincrement(),
	nasabah_id: t.int('nasabah_id').references(() => nasabah.id),
	tipe_sampah_id: t.int('tipe_sampah_id').references(() => tipeSampah.id),
	berat_kg: t.decimal('berat_kg', { precision: 10, scale: 2 }).notNull(),
	total_harga: t.decimal('total_harga', { precision: 12, scale: 2 }).notNull(),
	updated_at: t.timestamp(),
	created_at: t.timestamp().defaultNow().notNull(),
	deleted_at: t.timestamp(),
}, (table) => [
	t.foreignKey({
		name: 'nasabah_fk',
		columns: [table.nasabah_id],
		foreignColumns: [nasabah.id]
	}),
	t.foreignKey({
		name: 'tipe_sampah_fk',
		columns: [table.tipe_sampah_id],
		foreignColumns: [tipeSampah.id]
	})
])
export const bukuTabungan = table('buku_tabungan', {
	id: t.int('id').autoincrement().primaryKey(),
	nasabah_id: t.int('nasabah_id').references(() => nasabah.id),
	keterangan: t.varchar('keterangan', { length: 255 }).notNull(),
	debit: t.decimal('debit', { precision: 12, scale: 2 }),
	kredit: t.decimal('kredit', { precision: 12, scale: 2 }),
	saldo: t.decimal('saldo', { precision: 12, scale: 2 }).notNull(),
	updated_at: t.timestamp(),
	created_at: t.timestamp().defaultNow().notNull(),
	deleted_at: t.timestamp(),
}, (table) => [
	t.foreignKey({
		name: 'nasabah_fk',
		columns: [table.nasabah_id],
		foreignColumns: [nasabah.id]
	})
]);

export const session = table('session', {
	id: t.varchar('id', { length: 255 }).primaryKey(),
	user_id: t.int('user_id').references(() => users.id),
	expiresAt: t.datetime('expires_at').notNull()
}, (table) => [
	t.foreignKey({
		name: 'user_fk',
		columns: [table.user_id],
		foreignColumns: [users.id]
	})
]);

export type Session = typeof session.$inferSelect;

export type User = typeof users.$inferSelect;
