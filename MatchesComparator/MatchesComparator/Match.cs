using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MatchesComparator
{
	public class Match
	{
		private string home;
		private string visitor;
		private List<double> quotas;

		public List<string> HomeNames = new List<string>();
		public List<string> VisitorNames = new List<string>();

		public Match(string home, string visitor)
		{
			this.home = home;
			this.visitor = visitor;
			quotas = new List<double>();

			HomeNames.Add(home);
			VisitorNames.Add(visitor);
		}

		public void AddQuotas(double zeroTwo, double threePlus)
		{
			quotas.Add(zeroTwo);
			quotas.Add(threePlus);
		}

		public void AddQuotas(double zeroTwo, double threePlus, int index)
		{
			for(int i = index; i > 0; i--)
			{
				quotas.Add(0);
				quotas.Add(0);
			}

			quotas.Add(zeroTwo);
			quotas.Add(threePlus);
		}

		public string Home
		{
			get
			{
				return home;
			}
		}

		public string Visitor
		{
			get
			{
				return visitor;
			}
		}

		public int Id {get;set;}
		

		public override string ToString()
		{
			return string.Join(" ; ", quotas);
		}

		public List<double> Quotas
		{
			get
			{
				return quotas;
			}
		}

	}
}
