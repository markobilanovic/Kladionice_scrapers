using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MatchesComparator
{
	public class MatchRepo
	{
		private Dictionary<int,Match> matches = new Dictionary<int,Match>();

		public MatchRepo() { }

		List<PossibleMatch> homeMatches = new List<PossibleMatch>(1);
		List<PossibleMatch> visitorsMatches = new List<PossibleMatch>(1);

		private string[] matchValues;
		private string home;
		private string visitor;
		private string zeroTwo;
		private double zeroTwoD;
		private string threePlus;
		private double threePlusD;

		private int dbCounter = 0;

		public void AddMatch(string line, int index)
		{
			if (string.IsNullOrEmpty(line))
				return;

			matchValues = line.Split('|');
			home = matchValues[0];
			visitor = matchValues[1];
			zeroTwo = matchValues[2];
			threePlus = matchValues[3];

			Match m = new Match(home, visitor);
			m.Id = dbCounter++;
			if (double.TryParse(zeroTwo, out zeroTwoD) && double.TryParse(threePlus, out threePlusD))
			{
				m.AddQuotas(zeroTwoD, threePlusD, index);
			}
			else
			{
				m.AddQuotas(0, 0, index);
			}

			matches.Add(m.Id,m);
		}


		
		public bool ProcessMatch(string line)
		{
			if (string.IsNullOrEmpty(line))
				return true;

			matchValues = line.Split('|');
			home = matchValues[0];
			visitor = matchValues[1];
			zeroTwo = matchValues[2];
			threePlus = matchValues[3];

			Match possibleMatch = null;
			List<Tuple<int,string, double>> allDistancesHome = new List<Tuple<int,string,double>>(100);
			List<Tuple<int, string, double>> allDistancesVisitor = new List<Tuple<int, string, double>>(100);

			foreach (Match m in matches.Values)
			{
				allDistancesHome.Add(new Tuple<int,string,double>(m.Id ,m.Home, Comparator.LevenshteinDistanceSoft(m.Home, home)));
				allDistancesVisitor.Add(new Tuple<int, string, double>(m.Id, m.Visitor, Comparator.LevenshteinDistanceSoft(m.Visitor, visitor)));
			}

			PossibleMatch homeMatch = new PossibleMatch() 
				{ 
					MainName = home, 
					Matches = allDistancesHome.OrderBy(x => x.Item3).Take(3).ToList() 
				};
			PossibleMatch visitorMatch = new PossibleMatch() 
				{ 
					MainName = visitor, 
					Matches = allDistancesVisitor.OrderBy(x => x.Item3).Take(3).ToList() 
				};

			foreach(var match in homeMatch.Matches)
			{
				Tuple<int, string, double> first = visitorMatch.Matches.FirstOrDefault(x => x.Item1 == match.Item1);
				if(first != null)
				{
					possibleMatch = matches[first.Item1];
				}
			}

			if (possibleMatch != null)
			{
				if (double.TryParse(zeroTwo, out zeroTwoD) && double.TryParse(threePlus, out threePlusD))
				{
					possibleMatch.AddQuotas(zeroTwoD, threePlusD);
					Console.WriteLine("-------------------SUCCESS---------------------");
					Console.WriteLine(string.Format("MOZZART:{0}\t-\t{1}\t{2}:{3}", possibleMatch.Home, possibleMatch.Visitor, possibleMatch.Quotas[0], possibleMatch.Quotas[1]));
					Console.WriteLine(string.Format("MAXBET :{0}\t-\t{1}\t{2}:{3}", home, visitor, possibleMatch.Quotas[2], possibleMatch.Quotas[3]));
				}
				else
				{
					possibleMatch.AddQuotas(0, 0);
				}
				//Console.ReadKey();
				return true;
			}

			//Console.ReadKey();
			return false;
		}

	}
}
