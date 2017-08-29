using System;
using System.Collections.Generic;
using System.Linq;

namespace MatchesComparator
{
	public class Kladionica
	{
		private bool processed = false;
		private string ime;
		private List<Utakmica> sveUtakmice = new List<Utakmica>();
		private Dictionary<int, Utakmica> sortiraneUtakmice = new Dictionary<int, Utakmica>();

	

		public Kladionica(string ime)
		{
			this.ime = ime;
		}

		public void DodajUtakmicuUSortirane(Utakmica u)
		{
			if(sortiraneUtakmice.ContainsKey(u.Id))
			{
				Console.WriteLine(string.Format("Kladionica {0} : Utakmica {1}:{2}-{3} vec postoji.", ime, u.Id, u.Domacin, u.Gost));
				Console.WriteLine(string.Format("Stara vrednost {0}-{1}.", sortiraneUtakmice[u.Id].Domacin, sortiraneUtakmice[u.Id].Gost));
				return;
			}

			sortiraneUtakmice.Add(u.Id, u);
		}

		public void DodajUtakmicuUSve(Utakmica u)
		{
			sveUtakmice.Add(u);
		}

		public void LoadData(string[] lines)
		{
			Utakmica utakmica;
			foreach (string line in lines)
			{
				if(TryParseUtakmicu(line, out utakmica))
				{
					if (!UtakmicaPostoji(utakmica))
					{
						DodajUtakmicuUSve(utakmica);
					}
				}
			}
		}

		private bool UtakmicaPostoji(Utakmica utakmica)
		{
			if (sveUtakmice.Where(u => u.Domacin == utakmica.Domacin && u.Gost == utakmica.Gost).Count() > 0)
				return true;
			else 
				return false;
		}

		private bool TryParseUtakmicu(string csvLine, out Utakmica utakmica)
		{
			utakmica = null;

			try
			{
				
				if (string.IsNullOrEmpty(csvLine))
					return false;

				double nulaDvaD;
				double triPlusD;
				string[] matchValues = csvLine.Split('|');
				string domacin = matchValues[0];
				string gost = matchValues[1];
				string nulaDva = matchValues[2];
				string triPlus = matchValues[3];

				if (double.TryParse(nulaDva, out nulaDvaD) && double.TryParse(triPlus, out triPlusD))
				{
					if (nulaDvaD != 0 && triPlusD != 0)
					{
						utakmica = new Utakmica(domacin, gost, nulaDvaD, triPlusD);
						return true;
					}
				}

				return false;
			}
			catch(Exception e)
			{
				Console.WriteLine(e.Message);
				Console.WriteLine(e.StackTrace);
				return false;
			}
		}


		public string Ime
		{
			get
			{
				return ime;
			}
		}

		public List<Utakmica> SveUtakmice
		{
			get
			{
				return sveUtakmice;
			}
		}

		public Dictionary<int, Utakmica> SortiraneUtakmice
		{
			get
			{
				return sortiraneUtakmice;
			}
		}

		public int BrojUtakmica
		{
			get
			{
				return sveUtakmice.Count;
			}
		}

		public bool Processed
		{
			get
			{
				return processed;
			}
			set
			{
				processed = value;
			}
		}


	}
}