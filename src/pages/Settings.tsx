import React, { useState, useEffect } from "react";
import { isDatabaseEmpty, seedDatabase } from "../database/seed";
import { deleteDatabase } from "../database/db";
import { Button } from "../components/common/Button";

const Settings: React.FC = () => {
  const [isDbEmpty, setIsDbEmpty] = useState<boolean>(true);

  useEffect(() => {
    checkDatabase();
  }, []);

  const checkDatabase = async () => {
    const empty = await isDatabaseEmpty();
    setIsDbEmpty(empty);
  };

  const handleSeedClick = async () => {
    try {
      await seedDatabase();
      await checkDatabase();
    } catch (error) {
      console.error("Failed to seed database:", error);
    }
  };

  const handleDeleteClick = async () => {
    console.warn("delete triggered");
    if (
      window.confirm(
        "Are you sure you want to delete all database entries? This cannot be undone.",
      )
    ) {
      try {
        await deleteDatabase();
        await checkDatabase();
      } catch (error) {
        console.error("Failed to delete database:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Database</h2>

        <div className="flex items-center space-x-4">
          {isDbEmpty ? (
            <Button
              uiType="primary"
              text="Seed Database"
              type="button"
              onClick={handleSeedClick}
            />
          ) : (
            <Button
              uiType="secondary"
              text="Delete Database"
              type="button"
              onClick={handleDeleteClick}
            />
          )}

          <span className="text-sm text-gray-600">
            {isDbEmpty
              ? "Database is empty. Click to seed with initial data."
              : "Database contains data!"}
          </span>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Tags</h2>
      </div>
    </div>
  );
};
export default Settings;
