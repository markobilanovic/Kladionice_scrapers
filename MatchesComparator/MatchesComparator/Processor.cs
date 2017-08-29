using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace MatchesComparator
{
	public class Processor
	{
		private List<Kladionica> kladionice = new List<Kladionica>();
		private Kladionica masterKladionica;
		private int idGenerator = 0;

		public Processor() 
		{
			masterKladionica = new Kladionica("MasterKladionica");
		}

		public void ProcessFiles(string[] filenames)
		{
			//parsiranje svih fajlova u kladionice
			string[] lines;
			foreach (string filename in filenames)
			{
				Kladionica k = new Kladionica(Path.GetFileNameWithoutExtension(filename));
				lines = File.ReadAllText(filename).Replace(",", ".").Split('\n');
				k.LoadData(lines);
				kladionice.Add(k);
			}

			//uzima se kladionica sa najvise utakmica i utakmice se assigne-uju u masterKladionici
			Kladionica kladionicaSaNajviseUtakmica = kladionice.OrderByDescending(k => k.BrojUtakmica).First();
			foreach(Utakmica u in kladionicaSaNajviseUtakmica.SveUtakmice)
			{
				u.Id = idGenerator++;
				kladionicaSaNajviseUtakmica.DodajUtakmicuUSortirane(u);
				masterKladionica.DodajUtakmicuUSortirane(u);
				masterKladionica.DodajUtakmicuUSve(u);
			}
			kladionicaSaNajviseUtakmica.Processed = true;

			//obradjuju se ostale kladionice
			foreach(Kladionica k in kladionice)
			{
				if (k.Processed)
					continue;

				int id;
				foreach (Utakmica u in k.SveUtakmice)
				{
					if (TryFindMatchInMaster(u, out id))
					{
						u.Id = id;
						//TODO: pogledati da li ima vec pod tim IDjem iz te kladionice u sortiranim
						//ako ima uporediti postojecu i ovu sa masterom....koja bolje pase ta se assignuje, a druga se dodaje u master
						k.DodajUtakmicuUSortirane(u);
					}
					else
					{
						u.Id = idGenerator++;
						masterKladionica.DodajUtakmicuUSortirane(u);
						masterKladionica.DodajUtakmicuUSve(u);
						k.DodajUtakmicuUSortirane(u);
					}
				}
				k.Processed = true;
			}

		}

		private bool TryFindMatchInMaster(Utakmica u, out int id)
		{
			id = 0;
			List<Tuple<int, string, double>> allDistancesHome = new List<Tuple<int, string, double>>(100);
			List<Tuple<int, string, double>> allDistancesVisitor = new List<Tuple<int, string, double>>(100);

			foreach (Utakmica utakmicaIzMaster in masterKladionica.SveUtakmice)
			{
				allDistancesHome.Add(new Tuple<int, string, double>(utakmicaIzMaster.Id, utakmicaIzMaster.Domacin, Comparator.LevenshteinDistanceSoft(utakmicaIzMaster.Domacin, u.Domacin)));
				allDistancesVisitor.Add(new Tuple<int, string, double>(utakmicaIzMaster.Id, utakmicaIzMaster.Gost, Comparator.LevenshteinDistanceSoft(utakmicaIzMaster.Gost, u.Gost)));
			}

			PossibleMatch homeMatch = new PossibleMatch()
			{
				MainName = u.Domacin,
				Matches = allDistancesHome.OrderBy(x => x.Item3).Take(3).ToList()
			};
			PossibleMatch visitorMatch = new PossibleMatch()
			{
				MainName = u.Gost,
				Matches = allDistancesVisitor.OrderBy(x => x.Item3).Take(3).ToList()
			};

			foreach (var match in homeMatch.Matches)
			{
				Tuple<int, string, double> first = visitorMatch.Matches.FirstOrDefault(x => x.Item1 == match.Item1);
				if (first != null)
				{
					id = first.Item1;
				}
			}

			return id > 0;
		}


		public void PrintResults(string allResutlsFilename, string hitResultsFilename)
		{
			string lineSeparator = "*****************************************";
			StringBuilder sbAllResults = new StringBuilder();
			List<int> kljuceviPogodjenihUtakmica = new List<int>();
			StringBuilder sbHit = new StringBuilder();
			bool zeroTwoHit = false;
			bool threePlusHit = false;
			Utakmica utakmica;
			
			for (int i = 0; i < masterKladionica.BrojUtakmica; i++)
			{
				zeroTwoHit = false;
				threePlusHit = false;

				foreach (Kladionica k in kladionice)
				{
					if(k.SortiraneUtakmice.TryGetValue(i, out utakmica))
					{
						sbAllResults.AppendLine(string.Format("G{0},{1},{2},{3},{4},{5}",utakmica.Id, k.Ime, utakmica.Domacin, utakmica.Gost, utakmica.NulaDvaKvota, utakmica.TriPlusKvota));
						if (utakmica.NulaDvaKvota >= 2)
							zeroTwoHit = true;
						if (utakmica.TriPlusKvota >= 2)
							threePlusHit = true;
					}
				}

				sbAllResults.AppendLine(lineSeparator);

				if (zeroTwoHit && threePlusHit)
				{
					kljuceviPogodjenihUtakmica.Add(i);
				}
			}

			foreach (int id in kljuceviPogodjenihUtakmica)
			{
				foreach (Kladionica k in kladionice)
				{
					if (k.SortiraneUtakmice.TryGetValue(id, out utakmica))
					{
						sbHit.AppendLine(string.Format("G{0},{1},{2},{3},{4},{5}", utakmica.Id, k.Ime, utakmica.Domacin, utakmica.Gost, utakmica.NulaDvaKvota, utakmica.TriPlusKvota));
					}
				}
				sbHit.AppendLine(lineSeparator);
			}


			System.IO.StreamWriter file = new System.IO.StreamWriter(allResutlsFilename);
			file.Write(sbAllResults.ToString());
			file.Flush();

			file = new System.IO.StreamWriter(hitResultsFilename);
			file.Write(sbHit.ToString());
			file.Flush();
		}

	}
}
