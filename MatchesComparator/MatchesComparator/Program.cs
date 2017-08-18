using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace MatchesComparator
{
	class Program
	{
		static void Main(string[] args)
		{
			MatchRepo repo = new MatchRepo();

			string databaseFolder = "\\csv";
			string[] filenames = Directory.GetFiles(Directory.GetCurrentDirectory() + databaseFolder);

			//process first file
			String[] lines = File.ReadAllText(filenames[0]).Replace(",", ".").Split('\n');
			foreach (string line in lines)
			{
				repo.AddMatch(line, 0);
			}


			Dictionary<string, bool> processedLines = new Dictionary<string, bool>();
			//process rest of the files
			for (int i = 1; i < filenames.Length; i++)
			{
				processedLines.Clear();
				lines = File.ReadAllText(filenames[i]).Replace(",", ".").Split('\n');
				foreach (string line in lines)
				{
					bool result = repo.ProcessMatch(line);
					if(!processedLines.ContainsKey(line))
					{
						processedLines.Add(line, result);
					}
				}

				int uspele = 0;
				//Console.WriteLine(string.Format("PRONASAO: {0}", processedLines.Where(o => o.Value == true).Count));
				foreach(KeyValuePair<string, bool> kvp in processedLines)
				{
					if(kvp.Value)
					{
						uspele++;
					}
					else
					{
						repo.AddMatch(kvp.Key, i);
					}
				}
				//Console.WriteLine(string.Format("USPELE {0}", uspele));
			}

			StringBuilder sb = new StringBuilder();
			foreach(KeyValuePair<int, Match> kvp in repo.Matches)
			{
				Match m = kvp.Value;
				string line = "";
				for(int i = 0; i < m.HomeNames.Count; i++)
				{
					line += string.Format("|{0} | {1} | {2} | {3}\t-", m.HomeNames[i], m.VisitorNames[i], m.Quotas[i*2], m.Quotas[i*2+1]);
				}
				sb.AppendLine(line);
			}


			System.IO.StreamWriter file = new System.IO.StreamWriter("hereIam.txt");
			file.Write(sb.ToString());
			file.Flush();
			//Console.ReadKey();
		}

	}
}
