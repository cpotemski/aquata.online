-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('RESET_PASSWORD', 'CONFIRM_EMAIL');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('ALUMINIUM', 'STEEL', 'PLUTONIUM');

-- CreateEnum
CREATE TYPE "BuildJobType" AS ENUM ('SHIP', 'HARVESTER');

-- CreateEnum
CREATE TYPE "FleetAction" AS ENUM ('ATTACK', 'DEFEND');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'ALERT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "role" "Role" NOT NULL DEFAULT E'USER',
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "allianceId" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "userId" TEXT,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "handle" TEXT NOT NULL,
    "hashedSessionToken" TEXT,
    "antiCSRFToken" TEXT,
    "publicData" TEXT,
    "privateData" TEXT,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "userId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sentTo" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Station" (
    "userId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "harvester" INTEGER NOT NULL DEFAULT 10,
    "aluminiumPercentage" INTEGER NOT NULL DEFAULT 40,
    "steelPercentage" INTEGER NOT NULL DEFAULT 35,
    "aluminiumHarvester" INTEGER NOT NULL DEFAULT 4,
    "steelHarvester" INTEGER NOT NULL DEFAULT 3,
    "plutoniumHarvester" INTEGER NOT NULL DEFAULT 3,
    "aluminium" INTEGER NOT NULL DEFAULT 1000,
    "steel" INTEGER NOT NULL DEFAULT 1000,
    "plutonium" INTEGER NOT NULL DEFAULT 1000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceNode" (
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "type" "ResourceType" NOT NULL
);

-- CreateTable
CREATE TABLE "BuildJob" (
    "userId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "type" "BuildJobType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "timeLeft" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fleet" (
    "userId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "stationId" TEXT,
    "targetId" TEXT,
    "action" "FleetAction",
    "baseFleet" BOOLEAN NOT NULL DEFAULT false,
    "travelTime" INTEGER,
    "remainingTime" INTEGER,
    "actionTicks" INTEGER,
    "returning" BOOLEAN,
    "aluminium" INTEGER NOT NULL DEFAULT 0,
    "steel" INTEGER NOT NULL DEFAULT 0,
    "plutonium" INTEGER NOT NULL DEFAULT 0,
    "piranha" INTEGER NOT NULL DEFAULT 0,
    "jellyfish" INTEGER NOT NULL DEFAULT 0,
    "shark" INTEGER NOT NULL DEFAULT 0,
    "hackboat" INTEGER NOT NULL DEFAULT 0,
    "taifun" INTEGER NOT NULL DEFAULT 0,
    "blizzard" INTEGER NOT NULL DEFAULT 0,
    "hurricane" INTEGER NOT NULL DEFAULT 0,
    "tsunami" INTEGER NOT NULL DEFAULT 0,
    "enterprise" INTEGER NOT NULL DEFAULT 0,
    "bermuda" INTEGER NOT NULL DEFAULT 0,
    "kittyhawk" INTEGER NOT NULL DEFAULT 0,
    "atlantis" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "userId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commandship" (
    "userId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "userId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "public" BOOLEAN NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alliance" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session.handle_unique" ON "Session"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Token.hashedToken_type_unique" ON "Token"("hashedToken", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Station.userId_unique" ON "Station"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Station.x_y_unique" ON "Station"("x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceNode.x_y_unique" ON "ResourceNode"("x", "y");

-- CreateIndex
CREATE UNIQUE INDEX "BuildJob.userId_timeLeft_type_unique" ON "BuildJob"("userId", "timeLeft", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Commandship_userId_unique" ON "Commandship"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_ChatToUser_AB_unique" ON "_ChatToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatToUser_B_index" ON "_ChatToUser"("B");

-- AddForeignKey
ALTER TABLE "User" ADD FOREIGN KEY ("allianceId") REFERENCES "Alliance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BuildJob" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD FOREIGN KEY ("stationId") REFERENCES "Station"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD FOREIGN KEY ("targetId") REFERENCES "Station"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commandship" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD FOREIGN KEY ("chatId") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD FOREIGN KEY ("A") REFERENCES "Chat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatToUser" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
