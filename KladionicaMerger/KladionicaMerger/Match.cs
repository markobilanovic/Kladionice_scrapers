using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KladionicaMerger
{
	public class Match
	{
		private string home;
		private string visitor;
		private List<double> quotas;

		public Match(string home, string visitor)
		{
			this.home = home;
			this.visitor = visitor;
			quotas = new List<double>();
		}

		public void AddQuotas(double zeroTwo, double threePlus)
		{
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
	}
}
