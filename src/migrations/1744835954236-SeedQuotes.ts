import { MigrationInterface, QueryRunner } from "typeorm";

export class  SeedQuotes1744835954236  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const frasesReales = [
      { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
      { text: "The body achieves what the mind believes.", author: "Jim Evans" },
      { text: "No pain, no gain.", author: "Benjamin Franklin" },
      { text: "Train insane or remain the same.", author: "Jillian Michaels" },
      { text: "Don’t limit your challenges, challenge your limits.", author: "Jerry Dunn" },
      { text: "Strength does not come from the physical capacity. It comes from an indomitable will.", author: "Mahatma Gandhi" },
      { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
      { text: "Pain is temporary, pride is forever.", author: "Lance Armstrong" },
      { text: "The only bad workout is the one that didn’t happen.", author: "Unknown" },
      { text: "Be stronger than your excuses.", author: "Unknown" },
    ];

    const frases365 = Array.from({ length: 365 }).map((_, i) => {
      const f = frasesReales[i % frasesReales.length];
      return `('${f.text.replace(/'/g, "''")}', '${f.author.replace(/'/g, "''")}', ${i + 1}, 1)`;
    });

    await queryRunner.query(`
      INSERT INTO "quote" ("text", "author", "dayOfYear", "gymId")
      VALUES ${frases365.join(", ")};
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "quote"`);
  }
}
