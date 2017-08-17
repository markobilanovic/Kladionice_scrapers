using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MatchesComparator
{
	public class PossibleMatch
	{
		public string MainName {get; set;}
		public List<Tuple<int,string, double>> Matches {get;set;}
	}
}
