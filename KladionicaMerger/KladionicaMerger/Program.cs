using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KladionicaMerger
{
	class Program
	{
		static void Main(string[] args)
		{
			//StringBuilder masterTableSB = new StringBuilder();
			//string masterFilename = "masterTable.csv";

			MatchRepo repo = new MatchRepo();

			string databaseFolder = "\\csv";
			string[] filenames = Directory.GetFiles(Directory.GetCurrentDirectory() + databaseFolder);

			int fileCounter = 0;
			foreach (string filename in filenames)
			{
				fileCounter++;
				String[] lines = File.ReadAllText(filename).Split('\n');

				foreach (string line in lines)
				{
					if (fileCounter == 1)
					{
						repo.AddMatch(line);
					}
					else
					{
						repo.ProcessMatch(line);
					}
				}
			}


			Console.ReadKey();
		}


	}
}
