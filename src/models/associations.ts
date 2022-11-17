import { Addon } from './addon';
import { Entity } from './entity';

Addon.hasMany(Entity, { sourceKey: 'id', foreignKey: 'addonId' });
Entity.belongsTo(Addon, { targetKey: 'id', foreignKey: 'addonId' });
