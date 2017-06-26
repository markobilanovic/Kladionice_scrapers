using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KladionicaMerger
{
	public class MatchRepo
	{
		private List<Match> matches = new List<Match>();

		public MatchRepo() { }

		private string[] matchValues;
		private string home;
		private string visitor;
		private string zeroTwo;
		private double zeroTwoD;
		private string threePlus;
		private double threePlusD;

		public void AddMatch(string line)
		{
			if (string.IsNullOrEmpty(line))
				return;

			matchValues = line.Split('|');
			home = matchValues[0];
			visitor = matchValues[1];
			zeroTwo = matchValues[2];
			threePlus = matchValues[3];

			Match m = new Match(home, visitor);

			if(double.TryParse(zeroTwo, out zeroTwoD) && double.TryParse(threePlus, out threePlusD))
			{
				m.AddQuotas(zeroTwoD, threePlusD);
			}

			matches.Add(m);
		}



		public void ProcessMatch(string line)
		{
			if (string.IsNullOrEmpty(line))
				return;

			matchValues = line.Split('|');
			home = matchValues[0];
			visitor = matchValues[1];
			zeroTwo = matchValues[2];
			threePlus = matchValues[3];

			double minDistance = double.MaxValue;
			double dist = 0;
			Match possibleMatch = null;

			foreach(Match m in matches)
			{
				dist = Comparator.LevenshteinDistanceSoft(home, m.Home);
				if (dist < minDistance)
				{
					minDistance = dist;
					possibleMatch = m;
				}
			}

			if (possibleMatch != null)
			{
				if (double.TryParse(zeroTwo, out zeroTwoD) && double.TryParse(threePlus, out threePlusD))
				{
					possibleMatch.AddQuotas(zeroTwoD, threePlusD);
				}
			}
			else
			{
				possibleMatch.AddQuotas(0, 0);
			}

		}





	}
}
