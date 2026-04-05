USE control_car;

-- --------------------------------------------------------

--
-- Table structure for table `demande` 
--

CREATE TABLE `demande` (
  `id_demande` int(11) NOT NULL,
  `iduser` int(11) NOT NULL,
  `matricule` varchar(255) NOT NULL,
  `adresse` varchar(400) NOT NULL,
  `telephone` int(11) NOT NULL,
  `time` time NOT NULL,
  `date` date NOT NULL,
  `status` enum('en attente','en cours','terminer','annuler') NOT NULL DEFAULT 'en attente',
  `lien` varchar(400) NOT NULL,
  `idmarque` int(11) NOT NULL,
  `idtype` int(11) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `diagnostic` 
--

CREATE TABLE `diagnostic` (
  `id` int(11) NOT NULL,
  `apparence_exterieure` tinyint(1) DEFAULT NULL,
  `apparence_exterieure_image` varchar(255) DEFAULT '',
  `carrosserie` tinyint(1) DEFAULT NULL,
  `carrosserie_image` varchar(255) DEFAULT '',
  `pneu_av_gauche` tinyint(1) DEFAULT NULL,
  `pneu_av_gauche_image` varchar(255) DEFAULT '',
  `pneu_av_droit` tinyint(1) DEFAULT NULL,
  `pneu_av_droit_image` varchar(255) DEFAULT '',
  `pneu_ar_droit` tinyint(1) DEFAULT NULL,
  `pneu_ar_droit_image` varchar(255) DEFAULT '',
  `pneu_ar_gauche` tinyint(1) DEFAULT NULL,
  `pneu_ar_gauche_image` varchar(255) DEFAULT '',
  `roue_secours` tinyint(1) DEFAULT NULL,
  `roue_secours_image` varchar(255) DEFAULT '',
  `phare_ar_droit` tinyint(1) DEFAULT NULL,
  `phare_ar_droit_image` varchar(255) DEFAULT '',
  `phare_ar_gauche` tinyint(1) DEFAULT NULL,
  `phare_ar_gauche_image` varchar(255) DEFAULT '',
  `phare_av_gauche` tinyint(1) DEFAULT NULL,
  `phare_av_gauche_image` varchar(255) DEFAULT '',
  `phare_av_droit` tinyint(1) DEFAULT NULL,
  `phare_av_droit_image` varchar(255) DEFAULT '',
  `clignotants` tinyint(1) DEFAULT NULL,
  `clignotants_image` varchar(255) DEFAULT '',
  `ampoules` tinyint(1) DEFAULT NULL,
  `ampoules_image` varchar(255) DEFAULT '',
  `essuie_glaces` tinyint(1) DEFAULT NULL,
  `essuie_glaces_image` varchar(255) DEFAULT '',
  `conforme_exterieur` tinyint(1) DEFAULT NULL,
  `apparence_interieur` tinyint(1) DEFAULT NULL,
  `apparence_interieur_image` varchar(255) DEFAULT '',
  `habitacle` tinyint(1) DEFAULT NULL,
  `habitacle_image` varchar(255) DEFAULT '',
  `tableau_bord` tinyint(1) DEFAULT NULL,
  `tableau_bord_image` varchar(255) DEFAULT '',
  `voyants` tinyint(1) DEFAULT NULL,
  `voyants_image` varchar(255) DEFAULT '',
  `compteur` tinyint(1) DEFAULT NULL,
  `compteur_image` varchar(255) DEFAULT '',
  `airbags` tinyint(1) DEFAULT NULL,
  `airbags_image` varchar(255) DEFAULT '',
  `ceintures` tinyint(1) DEFAULT NULL,
  `ceintures_image` varchar(255) DEFAULT '',
  `vitres` tinyint(1) DEFAULT NULL,
  `vitres_image` varchar(255) DEFAULT '',
  `retroviseurs` tinyint(1) DEFAULT NULL,
  `retroviseurs_image` varchar(255) DEFAULT '',
  `conforme_interieur` tinyint(1) DEFAULT NULL,
  `bloc_moteur` tinyint(1) DEFAULT NULL,
  `bloc_moteur_image` varchar(255) DEFAULT '',
  `transmission` tinyint(1) DEFAULT NULL,
  `transmission_image` varchar(255) DEFAULT '',
  `echappement` tinyint(1) DEFAULT NULL,
  `echappement_image` varchar(255) DEFAULT '',
  `demi_train_av_droit` tinyint(1) DEFAULT NULL,
  `demi_train_av_droit_image` varchar(255) DEFAULT '',
  `demi_train_av_gauche` tinyint(1) DEFAULT NULL,
  `demi_train_av_gauche_image` varchar(255) DEFAULT '',
  `demi_train_ar_droit` tinyint(1) DEFAULT NULL,
  `demi_train_ar_droit_image` varchar(255) DEFAULT '',
  `demi_train_ar_gauche` tinyint(1) DEFAULT NULL,
  `demi_train_ar_gauche_image` varchar(255) DEFAULT '',
  `conforme_mecanique` tinyint(1) DEFAULT NULL,
  `suspension` tinyint(1) DEFAULT NULL,
  `suspension_image` varchar(255) DEFAULT '',
  `direction` tinyint(1) DEFAULT NULL,
  `direction_image` varchar(255) DEFAULT '',
  `fumee` enum('normale','blanche','noire') DEFAULT NULL,
  `bruit_moteur` tinyint(1) DEFAULT NULL,
  `bruit_moteur_image` varchar(255) DEFAULT '',
  `dommages_image` varchar(255) DEFAULT '',
  `status` enum('Favorable','Défavorable') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `facture` 
--

CREATE TABLE `facture` (
  `idfacture` int(11) NOT NULL,
  `prix` decimal(10,0) NOT NULL,
  `id_demande` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marque_vehicule` 
--

CREATE TABLE `marque_vehicule` (
  `idmarque` int(11) NOT NULL,
  `idtype` int(11) NOT NULL,
  `marque` varchar(255) NOT NULL,
  `icone` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notification` 
--

CREATE TABLE `notification` (
  `id_notif` int(11) NOT NULL,
  `text` varchar(5000) NOT NULL,
  `date` datetime NOT NULL,
  `is_read` tinyint(1) NOT NULL,
  `iduser` int(11) NOT NULL,
  `id_demande` int(11) NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `type_vehicule` 
--

CREATE TABLE `type_vehicule` (
  `idtype` int(11) NOT NULL,
  `type` varchar(400) NOT NULL,
  `icone` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users` 
--

CREATE TABLE `users` (
  `iduser` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `adresse` text NOT NULL,
  `ville` varchar(255) NOT NULL,
  `email` varchar(500) NOT NULL,
  `telephone` int(11) NOT NULL,
  `password` varchar(400) NOT NULL,
  `photo` varchar(400) DEFAULT NULL,
  `role` enum('admin','client','technicien','') NOT NULL DEFAULT 'client',
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `demande` 
--
ALTER TABLE `demande` 
  ADD PRIMARY KEY (`id_demande`),
  ADD UNIQUE KEY `telephone` (`telephone`),
  ADD KEY `iduser` (`iduser`);

--
-- Indexes for table `diagnostic` 
--
ALTER TABLE `diagnostic` 
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `facture` 
--
ALTER TABLE `facture` 
  ADD PRIMARY KEY (`idfacture`),
  ADD KEY `id_demande` (`id_demande`);

--
-- Indexes for table `marque_vehicule` 
--
ALTER TABLE `marque_vehicule` 
  ADD PRIMARY KEY (`idmarque`),
  ADD KEY `idtype` (`idtype`);

--
-- Indexes for table `notification` 
--
ALTER TABLE `notification` 
  ADD PRIMARY KEY (`id_notif`);

--
-- Indexes for table `type_vehicule` 
--
ALTER TABLE `type_vehicule` 
  ADD PRIMARY KEY (`idtype`),
  ADD UNIQUE KEY `idtype` (`idtype`),
  ADD UNIQUE KEY `idtype_2` (`idtype`);

--
-- Indexes for table `users` 
--
ALTER TABLE `users` 
  ADD PRIMARY KEY (`iduser`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `telephone` (`telephone`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `demande` 
--
ALTER TABLE `demande` 
  MODIFY `id_demande` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `diagnostic` 
--
ALTER TABLE `diagnostic` 
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `facture` 
--
ALTER TABLE `facture` 
  MODIFY `idfacture` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `marque_vehicule` 
--
ALTER TABLE `marque_vehicule` 
  MODIFY `idmarque` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `notification` 
--
ALTER TABLE `notification` 
  MODIFY `id_notif` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `type_vehicule` 
--
ALTER TABLE `type_vehicule` 
  MODIFY `idtype` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

--
-- AUTO_INCREMENT for table `users` 
--
ALTER TABLE `users` 
  MODIFY `iduser` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1;

-- Insert default admin user
INSERT INTO `users` (`nom`, `prenom`, `adresse`, `ville`, `email`, `telephone`, `password`, `role`) 
VALUES ('Admin', 'System', 'Admin Address', 'Admin City', 'admin@controlcar.com', 123456789, '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert default vehicle types
INSERT INTO `type_vehicule` (`type`, `icone`) VALUES 
('Berline', '🚗'),
('SUV', '🚙'),
('Sport', '🏎️'),
('Utilitaire', '🚐'),
('Moto', '🏍️');

-- Insert default vehicle brands (using explicit IDs)
INSERT INTO `marque_vehicule` (`idmarque`, `idtype`, `marque`, `icone`) VALUES 
(1, 1, 'Renault', '🚗'),
(2, 1, 'Peugeot', '🚗'),
(3, 1, 'Citroën', '🚗'),
(4, 1, 'Volkswagen', '🚗'),
(5, 1, 'BMW', '🚗'),
(6, 2, 'Toyota', '🚙'),
(7, 2, 'Honda', '🚙'),
(8, 2, 'Ford', '🚙'),
(9, 2, 'Nissan', '🚙'),
(10, 3, 'Ferrari', '🏎️'),
(11, 3, 'Lamborghini', '🏎️'),
(12, 3, 'Porsche', '🏎️');

-- Now add the foreign key constraints after data is inserted
--
-- Constraints for dumped tables
--

--
-- Constraints for table `demande` 
--
ALTER TABLE `demande` 
  ADD CONSTRAINT `iduser` FOREIGN KEY (`iduser`) REFERENCES `users` (`iduser`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `facture` 
--
ALTER TABLE `facture` 
  ADD CONSTRAINT `id_demande` FOREIGN KEY (`id_demande`) REFERENCES `demande` (`id_demande`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `marque_vehicule` 
--
ALTER TABLE `marque_vehicule` 
  ADD CONSTRAINT `idtype` FOREIGN KEY (`idtype`) REFERENCES `type_vehicule` (`idtype`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
