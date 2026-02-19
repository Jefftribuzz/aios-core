import 'dotenv/config.js';
import { getDb, initDatabase } from '../config/database.js';
import pino from 'pino';

const logger = pino();

const seedData = {
  prayers: [
    // Cura
    { title: 'Oração de Cura Interior', text: 'Senhor, cure minhas feridas emocionais...', type: 'cura', duration_minutes: 5 },
    { title: 'Oração de Restauração', text: 'Restaura meu corpo e meu espírito...', type: 'cura', duration_minutes: 7 },
    { title: 'Oração de Saúde', text: 'Concede-me saúde plena...', type: 'cura', duration_minutes: 5 },
    { title: 'Oração de Alívio', text: 'Alivia meu sofrimento...', type: 'cura', duration_minutes: 6 },
    { title: 'Oração de Regeneração', text: 'Renova meu corpo e minha mente...', type: 'cura', duration_minutes: 8 },
    
    // Sabedoria
    { title: 'Oração por Sabedoria', text: 'Concede-me a sabedoria...', type: 'sabedoria', duration_minutes: 7 },
    { title: 'Oração de Discernimento', text: 'Ilumina meu discernimento...', type: 'sabedoria', duration_minutes: 6 },
    { title: 'Oração de Conhecimento', text: 'Abre-me aos conhecimentos...', type: 'sabedoria', duration_minutes: 5 },
    { title: 'Oração de Orientação', text: 'Guia meus passos com sabedoria...', type: 'sabedoria', duration_minutes: 8 },
    { title: 'Oração de Insight', text: 'Traz insights profundos...', type: 'sabedoria', duration_minutes: 7 },
    
    // Libertação
    { title: 'Oração de Libertação', text: 'Liberte-me de minhas correntes...', type: 'libertacao', duration_minutes: 8 },
    { title: 'Oração de Liberdade', text: 'Concede-me liberdade verdadeira...', type: 'libertacao', duration_minutes: 7 },
    { title: 'Oração de Rompimento', text: 'Rompo com que me prende...', type: 'libertacao', duration_minutes: 6 },
    { title: 'Oração de Transformação', text: 'Transforma-me completamente...', type: 'libertacao', duration_minutes: 9 },
    { title: 'Oração de Vitória', text: 'Alcançarei vitória neste jejum...', type: 'libertacao', duration_minutes: 7 },
    
    // Dedicação
    { title: 'Oração de Dedicação', text: 'Dedico este tempo a ti...', type: 'dedicacao', duration_minutes: 5 },
    { title: 'Oração de Compromisso', text: 'Renovo meu compromisso...', type: 'dedicacao', duration_minutes: 6 },
    { title: 'Oração de Devoção', text: 'Minha devoção é completa...', type: 'dedicacao', duration_minutes: 7 },
    { title: 'Oração de Entrega', text: 'Me entrego completamente...', type: 'dedicacao', duration_minutes: 8 },
    { title: 'Oração de Foco', text: 'Mantenho meu foco em ti...', type: 'dedicacao', duration_minutes: 5 }
  ],

  meditations: [
    { title: 'Respiração Guiada - Iniciante', description: 'Meditação de respiração para iniciantes', audio_url: 'https://example.com/breathing-1.mp3', duration_minutes: 5, type: 'guided' },
    { title: 'Respiração Guiada - Intermediário', description: 'Meditação para nível intermediário', audio_url: 'https://example.com/breathing-2.mp3', duration_minutes: 10, type: 'guided' },
    { title: 'Respiração Guiada - Avançado', description: 'Meditação profunda para praticantes', audio_url: 'https://example.com/breathing-3.mp3', duration_minutes: 15, type: 'guided' },
    { title: 'Música Espiritual - Cura', description: 'Música de fundo para meditação de cura', audio_url: 'https://example.com/healing-music.mp3', duration_minutes: 20, type: 'music' },
    { title: 'Meditação da Manhã', description: 'Inicie seu dia com paz', audio_url: 'https://example.com/morning.mp3', duration_minutes: 12, type: 'guided' },
    { title: 'Meditação da Noite', description: 'Repouso e renovação', audio_url: 'https://example.com/evening.mp3', duration_minutes: 15, type: 'guided' },
    { title: 'Silêncio Sagrado', description: 'Silêncio com intenção', audio_url: null, duration_minutes: 10, type: 'silence' },
    { title: 'Meditação de Gratidão', description: 'Cultive a gratidão', audio_url: 'https://example.com/gratitude.mp3', duration_minutes: 8, type: 'guided' },
    { title: 'Meditação Profunda', description: 'Para praticantes avançados', audio_url: 'https://example.com/deep.mp3', duration_minutes: 25, type: 'guided' },
    { title: 'Mantras Sagrados', description: 'Recitação de mantras', audio_url: 'https://example.com/mantras.mp3', duration_minutes: 12, type: 'music' }
  ],

  meals: [
    // Refeições leves e nutritivas para jejum
    { title: 'Caldo de Osso', ingredients: 'ossos, água, sal', prep_time_minutes: 120, calories: 100, restrictions: '' },
    { title: 'Sopa de Legumes Leve', ingredients: 'cenoura, abóbora, sal', prep_time_minutes: 20, calories: 80, restrictions: 'vegan' },
    { title: 'Chá de Gengibre com Mel', ingredients: 'gengibre, mel, água', prep_time_minutes: 5, calories: 40, restrictions: '' },
    { title: 'Suco de Maçã Natural', ingredients: 'maçã, água', prep_time_minutes: 5, calories: 60, restrictions: 'vegan' },
    { title: 'Caldo de Frango', ingredients: 'frango, água, sal, ervas', prep_time_minutes: 60, calories: 120, restrictions: '' },
    { title: 'Chá de Camomila', ingredients: 'camomila, água', prep_time_minutes: 5, calories: 0, restrictions: 'vegan' },
    { title: 'Sopa Minestrone Light', ingredients: 'verduras variadas, caldo', prep_time_minutes: 25, calories: 90, restrictions: 'vegan' },
    { title: 'Água com Limão e Mel', ingredients: 'limão, mel, água', prep_time_minutes: 2, calories: 50, restrictions: 'vegan' },
    { title: 'Caldo de Vegetais', ingredients: 'cenoura, aipo, cebola', prep_time_minutes: 30, calories: 70, restrictions: 'vegan' },
    { title: 'Chá de Pimenta', ingredients: 'pimenta caiena, mel, água', prep_time_minutes: 3, calories: 20, restrictions: 'vegan' },
    { title: 'Sopa de Abóbora', ingredients: 'abóbora, cebola, sal', prep_time_minutes: 20, calories: 85, restrictions: 'vegan' },
    { title: 'Caldo com Vinagre de Maçã', ingredients: 'vinagre, água, sal', prep_time_minutes: 2, calories: 10, restrictions: 'vegan' },
    { title: 'Chá Verde', ingredients: 'chá verde, água', prep_time_minutes: 5, calories: 5, restrictions: 'vegan' },
    { title: 'Sopa de Cebola', ingredients: 'cebola, caldo de osso, sal', prep_time_minutes: 30, calories: 95, restrictions: '' },
    { title: 'Bebida Eletrolítica', ingredients: 'água, sal, limão, mel', prep_time_minutes: 2, calories: 30, restrictions: 'vegan' }
  ]
};

async function seed() {
  try {
    logger.info('Initializing database...');
    await initDatabase();

    const sql = getDb();

    logger.info('Seeding prayers...');
    for (const prayer of seedData.prayers) {
      await sql`
        INSERT INTO prayers (title, text, type, duration_minutes)
        VALUES (${prayer.title}, ${prayer.text}, ${prayer.type}, ${prayer.duration_minutes})
        ON CONFLICT DO NOTHING
      `;
    }
    logger.info(`✅ Seeded ${seedData.prayers.length} prayers`);

    logger.info('Seeding meditations...');
    for (const meditation of seedData.meditations) {
      await sql`
        INSERT INTO meditations (title, description, audio_url, duration_minutes, type)
        VALUES (${meditation.title}, ${meditation.description}, ${meditation.audio_url}, ${meditation.duration_minutes}, ${meditation.type})
        ON CONFLICT DO NOTHING
      `;
    }
    logger.info(`✅ Seeded ${seedData.meditations.length} meditations`);

    logger.info('Seeding meals...');
    for (const meal of seedData.meals) {
      await sql`
        INSERT INTO meals (title, ingredients, prep_time_minutes, calories, restrictions)
        VALUES (${meal.title}, ${meal.ingredients}, ${meal.prep_time_minutes}, ${meal.calories}, ${meal.restrictions})
        ON CONFLICT DO NOTHING
      `;
    }
    logger.info(`✅ Seeded ${seedData.meals.length} meals`);

    logger.info('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
